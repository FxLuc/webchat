var socket = io()
var room = []
var new_message_id_count = 0

socket.on(user._id, data => receiveMessage(data))

function sendMessage(input_element) {
    if (input_element.value.trim()) {
        socket.emit('chatbox', { from: user_profile.name, msg: input_element.value , room: user._id})
        input_element.value = ''
    }
}

function receiveMessage(data) {
    new_message_id_count++
    const new_mesage_class = `new_message_id_${new_message_id_count}`
    if (data.room == user._id) {
        chatbox_table.insertRow(-1).innerHTML =
        `<td class="col text-right" id="${new_mesage_class}">
            <div class="text-secondary px-2 ">${data.from}</div>
            <div class="col btn btn-info w-75 text-right rouded-send">
                ${data.msg}
            </div>
        </td>`
    } else {
        chatbox_table.insertRow(-1).innerHTML =
            `<td class="col text-left" id="${new_mesage_class}">
                <div class="text-secondary px-2 ">${data.from}</div>
                <div class="col btn btn-secondary w-75 text-left rouded-recieve">
                    <p>${data.msg} </p>
                </div>
            </td>`
    }
    document.getElementById(new_mesage_class).scrollIntoView()
}

function clearChatbox() {
    for (let i = chatbox_table.rows.length - 1; i > 0; i--) chatbox_table.deleteRow(i)
}