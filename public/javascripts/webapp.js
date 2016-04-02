/**
 * Created by Anurag Gautam on 01-04-2016.
 */

var TextField = React.createClass({
    getInitialState: function () {
        return {value: ''};
    },
    handleChange: function (event) {
        this.setState({value: event.target.value});
        this.props.onStateChange({name: this.props.name, value: event.target.value});
    },
    render: function () {
        return (
            <input
                type="text"
                className="text-field"
                name={this.props.name}
                id={this.props.id}
                placeholder={this.props.placeholder}
                value={this.state.value}
                onChange={this.handleChange}/>
        );
    }
});

var PasswordField = React.createClass({
    getInitialState: function () {
        return {value: ''};
    },
    handleChange: function (event) {
        this.setState({value: event.target.value});
        this.props.onStateChange({name: this.props.name, value: event.target.value});
    },
    render: function () {
        return (
            <input
                type="password"
                className="text-field"
                name={this.props.name}
                id={this.props.id}
                placeholder={this.props.placeholder}
                value={this.state.value}
                onChange={this.handleChange}/>
        );
    }
});

var LoginForm = React.createClass({
    getInitialState: function () {
        return {};
    },
    handleSubmit: function (event) {
        event.preventDefault();
        console.log(this.state);
        var self = this;
        $.post("/users", {username: this.state.username, password: this.state.password}, function (data) {
            if (data.code === 0) {
                console.log('You have logged in ');
                console.log(JSON.stringify(data.msg));
                // $(ReactDOM.findDOMNode(self)).hide();
                Lockr.set('session', data.msg);
                ReactDOM.render(<FilterableOnlineUsersList users={ONLINE_USERS}/>, document.getElementById('content'));
            }
            else {
                console.log('Un authorized');
                console.log(data.msg);
            }
        });
    },
    handleStateChange: function (data) {
        var key = data.name;
        var state = this.state;
        state[key] = data.value;
        this.setState(state);
    },
    render: function () {
        return (
            <div className="login-form">
                <h2>Login to mookit</h2>
                <form action="" method="POST" onSubmit={this.handleSubmit}>
                    <table>
                        <tr>
                            <td><TextField
                                name="username"
                                placeholder="Type in your username"
                                onStateChange={this.handleStateChange}/></td>
                        </tr>
                        <tr>
                            <td><PasswordField
                                name="password"
                                placeholder="Type your password"
                                onStateChange={this.handleStateChange}/></td>
                        </tr>
                        <tr>
                            <td><input type="submit" value="Log in"/></td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    }
});


var ListItem = React.createClass({
    render: function () {
        return (
            <div id={this.props.id} className="list-item">{this.props.value}</div>
        );
    }
});

var SearchField = React.createClass({
    getInitialState: function () {
        return {value: ''};
    },
    handleChange: function (e) {
        this.setState({value: e.target.value});
        this.props.onSearchInput(e.target.value);
    },
    render: function () {
        return (
            <input
                type="text"
                placeholder="Search"
                value={this.state.value}
                onChange={this.handleChange}/>
        );
    }
});

var OnlineUsers = React.createClass({

    render: function () {
        var onlineUsers = [];
        var self = this;
        this.props.users.forEach(function (user) {
            if (user.name.indexOf(self.props.filterText) !== -1) {
                onlineUsers.push(user);
            }
        });
        var listNodes = onlineUsers.map(function (user) {
            return (
                <ListItem id={user.id} key={user.id} value={user.name}/>
            );
        });
        return (
            <div id="ADIC" className="nano">
                <div className="nano-content">
                    <div className="list-panel">
                        {listNodes}
                    </div>
                </div>
            </div>
        );
    }
});

var FilterableOnlineUsersList = React.createClass({
    getInitialState: function () {
        return {filterText: ''};
    },
    handleSearchInput: function (text) {
        this.setState({filterText: text});
    },
    render: function () {
        return (
            <div className="online-user-list">
                <SearchField onSearchInput={this.handleSearchInput}/>
                <OnlineUsers users={this.props.users} filterText={this.state.filterText}/>
            </div>
        );
    }
});

var ChatItem = React.createClass({
    render: function () {
        return (
            <div className={'chat-item'}>
                <div className="chat-sender"><img src=""/></div>
                <div className="chat-content">
                    <div className="chat-sender-name">{this.props.fromUsername}</div>
                    <div>{this.props.content}</div>
                </div>
            </div>
        );
    }
});

var ChatList = React.createClass({
    render: function () {
        var chatNodes = this.props.messages.map(function (chat) {
            return (
                <ChatItem
                    content={chat.content}
                    fromUser={chat.fromUser}
                    ts={chat.ts}
                    key={chat.id}
                    fromUsername={chat.fromUsername}/>
            );
        });
        return (
            <div>
                {chatNodes}
            </div>
        );
    }
});

var MessageInput = React.createClass({
    getInitialState: function () {
        return {value: ''};
    },
    handleChange: function (e) {
        this.setState({value: e.target.innerHTML});
    },
    render: function () {
        return (
            <div className="message-input">
                <div>
                    <textarea onChange={this.handleChange} placeholder="Type a message...">{this.state.value}</textarea>
                </div>
                <div>Other actions</div>
            </div>
        );
    }
});

var ChatRoom = React.createClass({
    render: function () {
        return (
            <div className="chat-panel">
                <div className="chat-title">{this.props.chattingWith}</div>
                <ChatList messages={this.props.messages}/>
                <MessageInput/>
            </div>
        );
    }
});

var Messenger = React.createClass({
    getInitialState: function () {
        return {messages: []};
    },
    render: function () {
        return (
            <div>
                <div><h1>Here comes the title</h1></div>
                <div className="chat-room">
                    <div className="floating-panel w30">
                        <FilterableOnlineUsersList users={ONLINE_USERS}/>
                    </div>
                    <div className="floating-panel w70">
                        <ChatRoom messages={this.props.messages} chattingWith={this.props.chattingWith}/>
                    </div>
                </div>
            </div>
        );
    }
});

var DUMMY_CHAT = [
    {content: 'This is a test', fromUser: 1024, ts: Date.now(), id: 0.7, fromUsername: 'anurag'},
    {
        content: 'The onChange event behaves as you would expect it to: whenever a form field is changed this event is fired rather than inconsistently on blur. We intentionally break from existing browser behavior because onChange is a misnomer for its behavior and React relies on this event to react to user input in real time. See Forms for more details.',
        fromUser: 1025,
        ts: Date.now(),
        id: 0.6, fromUsername: 'riva'
    }
];

var ONLINE_USERS = [
    {id: 0.1, name: "Superman"},
    {id: 0.2, name: "Batman"},
    {id: 0.3, name: "Darksied"},
    {id: 0.4, name: "Matron"},
    {id: 0.51, name: "Anurag Gautam"},
    {id: 0.61, name: "Anurag Gautam"},
    {id: 0.71, name: "Anurag Gautam"},
    {id: 0.80, name: "Anurag Gautam"},
    {id: 0.90, name: "Anurag Gautam"},
    {id: 0.112, name: "Anurag Gautam"},
    {id: 0.121, name: "Anurag Gautam"},
    {id: 0.120, name: "Anurag Gautam"},
    {id: 0.130, name: "Anurag Gautam"},
    {id: 0.140, name: "Anurag Gautam"},
    {id: 0.160, name: "Anurag Gautam"}
];


$(document).ready(function () {
    $(".nano").nanoScroller();

    if (Lockr.get('session')) {
        ReactDOM.render(<Messenger messages={DUMMY_CHAT} chattingWith="Anurag"/>, document.getElementById('content'));
    } else {
        ReactDOM.render(
            <div>
                <LoginForm/>
            </div>,
            document.getElementById('content')
        );
    }
});

