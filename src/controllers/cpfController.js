import axios from "axios";

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos	
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito	
    let add = 0;
    for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito	
    add = 0;
    for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

export const checkCpf = async (req, res) => {
    let invalidCPF = false
    let employeeFound = false
    let employeeNotFound = false

    let rawCpf = req.body.cpf

    const cpf = String(rawCpf.replace(/\D/g, ''))

    const validateCPF = validarCPF(cpf)

    if (!validateCPF) {
        invalidCPF = true
        res.render('pages/index', {
            invalidCPF
        })
        return
    }

    try {
        const { data } = await axios.get(`https://system.solides.com/pt-BR/api/v1/colaboradores/existe/${cpf}`, {
            headers: { Authorization: 'Token token=9e7545e473473c3274173cc77e39f2fe995d703a93d6d23539b8' }
        })

        if (data.status === 1) {
            employeeFound = true
            return res.render('pages/index', {
                employeeFound
            })
        } else {
            employeeNotFound = true
            return res.render('pages/index', {
                employeeNotFound
            })
        }
    }
    catch (e) {
        // console.log(e);
        employeeNotFound = true
        return res.render('pages/index', {
            employeeNotFound
        })
    }

}