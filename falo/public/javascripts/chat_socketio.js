var socket = io()
var room = []
room.push(document.getElementById('acc_id').innerText.toString())

socket.on(room[0], data => receiveMessage(data))

var chatbox_table = document.getElementById('chatbox_table')
var user_email = document.getElementById('user_email').innerText
var new_message_id_count = 0

function sendMessage(input_element) {
    if (input_element.value.trim()) {
        socket.emit('chatbox', { from: user_email, msg: input_element.value , room: room[0]})
        input_element.value = ''
    }
}
function receiveMessage(data) {
    new_message_id_count++
    const new_mesage_class = `new_message_id_${new_message_id_count}`
    if (data.from == user_email) {
        chatbox_table.insertRow(-1).innerHTML =
        `<div class="col text-right" id="${new_mesage_class}">
            <div class="text-secondary px-2 ">${data.from}</div>
            <div class="col btn btn-info w-75 text-right rouded-send">
                ${data.msg}
            </div>
        </div>`
    } else {
    chatbox_table.insertRow(-1).innerHTML =
        `<div class="col text-left" id="${new_mesage_class}">
            <div class="text-secondary px-2 ">${data.from}</div>
            <div class="col btn btn-secondary w-75 text-left rouded-recieve">
                <p>${data.msg} </p>
            </div>
        </div>`
    }
    document.getElementById(new_mesage_class).scrollIntoView()
}