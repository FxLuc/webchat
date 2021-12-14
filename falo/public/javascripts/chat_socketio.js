var socket = io()

socket.on('chat_box', data => receiveMessage(data))

var chatbox_table = document.getElementById('chatbox_table')
var user_email = document.getElementById('user_email').innerText

var new_message_id_count = 0
function sendMessage(input_element) {
    if (input_element.value.trim()) {
        socket.emit('chat_box', { from: user_email, msg: input_element.value })
        input_element.value = ''
    }
}
function receiveMessage(data) {
    new_message_id_count++
    const new_mesage_class = `new_message_id_${new_message_id_count}`
    if (data.from == user_email) {
        chatbox_table.insertRow(-1).innerHTML =
        `<div class="col text-right" id="${new_mesage_class}">
            <div class="text-secondary pl-2 ">${data.from}</div>
            <div class="col btn btn-info w-75 text-right">
                <p>${data.msg} </p>
            </div>
        </div>`
    } else {
    chatbox_table.insertRow(-1).innerHTML =
        `<div class="col text-left" id="${new_mesage_class}">
            <div class="text-secondary pl-2 ">${data.from}</div>
            <div class="col btn btn-secondary w-75 text-left">
                <p>${data.msg} </p>
            </div>
        </div>`
    }
    document.getElementById(new_mesage_class).scrollIntoView()
}


function w3_open() {
    document.getElementById("main").style.marginLeft = "25%"
    document.getElementById("sidebar").style.width = "25%"
    document.getElementById("sidebar").style.display = "block"
    document.getElementById("openNav").style.display = 'none'
}

function w3_close() {
    document.getElementById("main").style.marginLeft = "0%"
    document.getElementById("sidebar").style.width = "0%"
    document.getElementById("sidebar").style.display = "none"
    document.getElementById("openNav").style.display = "inline-block"
}