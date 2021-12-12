var validateArray = []
class Validate{
    constructor($formID){
        this.$formID = $formID
        this.$validateRes = []
    }
    get formID(){
        return this.$formID
    }
    get validateRes(){
        return this.$validateRes
    }
    set validateRes(arrValue){
        let index = this.$validateRes.findIndex(validateRes => validateRes.id == arrValue.id)
        if(index == '-1'){
            this.$validateRes.push(arrValue)
        }else{
            this.$validateRes[index] = arrValue
        }
    }
}
// source github.com/often127
// or contact me fb.me/often127
function showFeedback(formID, inputID, inputElementValue, inValid, feedback){
    const inputElement = document.forms[formID][inputID]
    let inputFeedback = inputElement.parentElement.querySelector('.form-feedback')
    inputFeedback == null ? inputFeedback = inputElement.parentElement.parentElement.querySelector('.form-feedback') : {}
    inputFeedback == null ? inputFeedback = inputElement.parentElement.parentElement.parentElement.querySelector('.form-feedback') : {}
    let index = validateArray.findIndex(validate => validate.formID == formID)
    if (inValid){
        inputFeedback.innerHTML = feedback
        inputElement.classList.remove('is-valid')
        inputElement.classList.add('is-invalid')
        validateArray[index].validateRes = {id: inputID, isValid: false, value: inputElementValue}
    } else{
        inputFeedback.innerHTML = ''
        inputElement.classList.remove('is-invalid')
        inputElement.classList.add('is-valid')
        validateArray[index].validateRes = {id: inputID, isValid: true, value: inputElementValue}
    }
}

function inputRequire(formID, inputID, RequiredFeedback = '*Trường này không được bỏ trống!', minLenght = 0, minLengthFeedback = '*Bạn phải nhập nhiều ký tự hơn nữa!'){
    const inputElement = document.forms[formID][inputID]
    inputElement.addEventListener('blur', e => {
        const inputElementValue = e.target.value.trim().valueOf()
        if (minLenght != 0) {
            inValid = (inputElementValue.length > 0 && inputElementValue.length < minLenght)
            showFeedback(formID, inputID, inputElementValue, inValid, minLengthFeedback)
        }
        let inValid = (inputElementValue == '')
        inValid? showFeedback(formID, inputID, inputElementValue, inValid, RequiredFeedback):{}
    })
    inputElement.addEventListener('input', e => {
        const inputElementValue = e.target.value.trim().valueOf()
        if (minLenght != 0) {
            inValid = (inputElementValue.length > 0 && inputElementValue.length < minLenght)
            showFeedback(formID, inputID, inputElementValue, inValid, minLengthFeedback)
        }
        let inValid = (inputElementValue == '')
        inValid ? showFeedback(formID, inputID, inputElementValue, inValid, RequiredFeedback) : {}
    })
    document.forms[formID].addEventListener('submit', () => {
        const inputElementValue = inputElement.value.trim().valueOf()
        const inValid = (inputElementValue == '')
        showFeedback(formID, inputID, inputElementValue, inValid, RequiredFeedback)
    })
}

function inputRegex(formID, inputID, regex, feedback){
    const inputElement = document.forms[formID][inputID]
    inputElement.addEventListener('input', e => {
        const inputElementValue = e.target.value.trim().valueOf()
        const inValid = !(regex.test(inputElementValue))
        showFeedback(formID, inputID, inputElementValue, inValid, feedback)
    })
    inputElement.addEventListener('blur', e => {
        const inputElementValue = e.target.value.trim().valueOf()
        const inValid = (inputElementValue != '' && !(regex.test(inputElementValue)))
        inValid ? showFeedback(formID, inputID, inputElementValue, inValid, feedback) : {}
    })
}

function inputConfirm(formID, inputID, targetID, feedback = 'Vui lòng kiểm tra và nhập lại đúng mật khẩu'){
    const inputElement = document.forms[formID][inputID]
    const inputTarget = document.forms[formID][targetID]
    inputElement.addEventListener('input', e => {
        const inputElementValue = e.target.value.trim().valueOf()
        const inputTargetValue = inputTarget.value.trim().valueOf()
        const inValid = (inputElementValue == '' || inputElementValue !== inputTargetValue)
        showFeedback(formID, inputID, inputElementValue, inValid, feedback)
    })
    inputElement.addEventListener('blur', e => {
        const inputElementValue = e.target.value.trim().valueOf()
        const inputTargetValue = inputTarget.value.trim().valueOf()
        const inValid = (inputElementValue == '' || inputElementValue !== inputTargetValue)
        showFeedback(formID, inputID, inputElementValue, inValid, feedback)
    })
    inputTarget.addEventListener('input', e => {
        const inputElementValue = inputElement.value.trim().valueOf()
        const inputTargetValue = e.target.value.trim().valueOf()
        const inValid = (inputElementValue == '' || inputElementValue !== inputTargetValue)
        showFeedback(formID, inputID, inputElementValue, inValid, feedback)
    })
}

// submit example
// function submitForm(formID){
//     const index = validateArray.findIndex((arr) => arr.formID == formID)
//     const formLegnth = (document.forms[formID].length)-1
//     const inValid = (validateArray[index].validateRes.length == formLegnth && !(validateArray[index].validateRes.some(validateRes => validateRes.isValid == false)))
//     if(inValid){
//         console.log(validateArray[index])
//     } else{
//         console.log(false)
//     }
// }

//validate rules example
// validateArray[validateArray.length] = new Validate('formSomethingSaga')
// inputConfirm('formSomethingSaga', 'userConfirmPass', 'userPassword')
// inputRequire('formSomethingSaga', 'userName', '*Hãy nhập tên của bạn!', 3, '*Tên của bạn có vẻ hơi ngắn')
// inputRequire('formSomethingSaga', 'userEmail', '*Hãy nhập email của bạn!')
// inputRequire('formSomethingSaga', 'userPassword', '*Chưa nhập password nè bạn ơi!')
// inputRequire('formSomethingSaga', 'userConfirmPass', '*Hãy nhập lại mật khẩu!')
// inputRegex('formSomethingSaga', 'userEmail', /\S+@\S+\.\S+/, '*Email của bạn không đúng')
// inputRegex('formSomethingSaga', 'userPassword', /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/, '*Password ít nhất 8 ký tự (bao gồm chữ, số và ký tự đặc biệt)')