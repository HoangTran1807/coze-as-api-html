

let history = []
let isChatboxOpen = false;
// các phím chức năng
// Enter: gửi tin nhắn
// ArrowUp: lấy lịch sử chat
// ArrowDown: xóa lịch sử chat
// Escape: ẩn chatbox
window.addEventListener('keydown', function(e) {
    if(e.key === 'Enter') {
        send();
        //scroll to bottom
        document.getElementById('chatbox').scrollTo(0, document.getElementById('chatbox').scrollHeight);
    }
    if(e.key === 'ArrowUp') {
        console.log(history);
    }

    if(e.key === 'ArrowDown') {
        clearhistory();
    }
    if(e.key === 'Escape') {
        this.document.getElementById('chat_field').style.display = 'none';
        this.document.getElementById('chat_bubble').style.display = 'block';
    }
});
// mỗi khi reload trang, load lịch sử chat
window.onload = function() {
    loadhistory();
    console.log(history);
}

// mỗi khi thoát trang, lưu lịch sử chat
window.onbeforeunload = function() {
    savehistory();
}

const token = "Your token here";
const baseUrl = "https://api.coze.com/open_api/v2/chat";

headers = {
    'Authorization': 'Bearer ' + token,
    'content-type': 'application/json',
    'accept': '/',
    'Host': 'api.coze.com',
    'connection': 'keep-alive',
}



function send() {
    const userInput = document.getElementById('userInput').value;
    const chatbox = document.getElementById('chatbox');
    const userMessage = document.createElement('p');
    userMessage.className = 'user_chat';
    userMessage.innerHTML = userInput;
    // khởi tạo đối tương userHistory
    let userHistory =
    {
        "role": "user",
        "type": "text",
        "content": userInput
    }

    //lưu đối tượng vào history
    history.push(userHistory);
    //hiển thị đoạn chat của user lên chatbox sau đó làm trống ô input
    chatbox.appendChild(userMessage);
    document.getElementById('userInput').value = '';
    // khởi tạo đối tượng data để gửi lên coze ai
    data = {
        "bot_id": "7375464174820360200",
        "user": "123333333",
        "query": userInput,
        "chat_history": history,
        "stream": false
    }
    fetch(baseUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        displayResponse(data);
    })
}

function displayResponse(data) {
    console.log(data);
    // tạo đối tượng html để hiển thị tin nhắn của bot
    const botMessage = document.createElement('p');
    //
    const response = data.messages;

    if(data.msg != 'success')
        return;
    for (let i = 0; i < response.length; i++) {
        // ở đây tôi chỉ lấy phản hổi có tag là anwser của bot
        if(response[i].type == 'answer'){
            botMessage.className = 'bot_chat';
            // xử lý dữ liệu trả về
            botMessage.innerHTML = PreProcessingAnwser(response[i].content);
            //lưu câu trả lời của bot vào history
            history.push(response[i]);
        }
            

    }
    // hiển thị câu trả lời của bot lên chatbox
    chatbox.appendChild(botMessage);
    // cuộn xuống cuối chatbox
    document.getElementById('chatbox').scrollTo(0, document.getElementById('chatbox').scrollHeight);
}

function PreProcessingAnwser(data) {
    const Image = data.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    const Link = Image.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="bot_img" href="$2">$1</a>');
    const NewLine = Link.replace(/\n/g, '<br>');
    return NewLine;
}

function savehistory(){
    localStorage.setItem('history', JSON.stringify(history));
}

function loadhistory(){
    history = JSON.parse(localStorage.getItem('history'));
    if(history == null)
        history = [];
    // show in chatbox
    const chatbox = document.getElementById('chatbox');
    for (let i = 0; i < history.length; i++) {
        if(history[i].role == 'user'){
            const userMessage = document.createElement('p');
            userMessage.className = 'user_chat';
            userMessage.innerHTML = history[i].content;
            chatbox.appendChild(userMessage);
        }
        else{
            const botMessage = document.createElement('p');
            botMessage.className = 'bot_chat';
            botMessage.innerHTML = PreProcessingAnwser(history[i].content);
            chatbox.appendChild(botMessage);
        }
    }
}

function clearhistory(){
    localStorage.removeItem('history');
    history = [];
    document.getElementById('chatbox').innerHTML = '';
}

document.getElementById('chat_bubble').addEventListener('click', function() {
    if(!isChatboxOpen){
        isChatboxOpen = true;
        document.getElementById('chat_field').style.display = 'none';
    }
    else{
        isChatboxOpen = false;
        document.getElementById('chat_field').style.display = 'block';
        document.getElementById("chat_bubble").style.display = 'none';
    }
});