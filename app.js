const app = new Vue({
  el: "#app",
  data: {
    loggedin: false,
    JWT: "",
    createUN: "",
    createPW: "",
    loginUN: "",
    loginPW: "",
    devURL: "http://localhost:3000",
    prodURL: "https://notesappbackend.herokuapp.com",
    user: null,
    token: null,
    notes: [],
    newNote: "",
    updateNote: "",
    editID: 0,
  },
  methods: {
    handleLogin: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = { username: this.loginUN, password: this.loginPW };
      console.log("hello");
      fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("error logging in");
          } else {
            this.user = data.user;
            this.token = data.token;
            this.loggedin = true;
            this.getNotes();
            this.loginPW = "";
            this.loginUN = "";
            window.sessionStorage.setItem("login", JSON.stringify(data));
          }
        });
    },
    handleLogout: function () {
      this.loggedin = false;
      this.user = null;
      this.token = null;
      window.sessionStorage.removeItem("login");
    },
    handleSignup: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = JSON.stringify({
        username: this.createUN,
        password: this.createPW,
      });
      console.log(user);

      fetch(`${URL}/users`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: user,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("sign up unsuccessful");
          } else {
            alert("signup successful");
            this.createUN = "";
            this.createPW = "";
          }
        });
    },
    getNotes: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      fetch(`${URL}/notes`, {
        method: "get",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.notes = data;
        });
    },
    createNote: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const note = { message: this.newNote };

      fetch(`${URL}/notes`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${this.token}`,
        },
        body: JSON.stringify(note),
      }).then((response) => {
        this.newNote = "";
        this.getNotes();
      });
    },
    deleteNote: function (event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;

      fetch(`${URL}/notes/${ID}`, {
        method: "delete",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }).then((response) => {
        this.getNotes();
      });
    },
    editNote: function (event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;
      const updated = { message: this.updateNote };

      fetch(`${URL}/notes/${ID}`, {
        method: "put",
        headers: {
          Authorization: `bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      }).then((response) => {
        this.getNotes();
      });
    },
    editSelect: function (event) {
      this.editID = event.target.id;
      console.log(this.editID, event.target.id);

      const theNote = this.notes.find((note) => {
        return note.id == this.editID;
      });

      this.updateNote = theNote.message;
    },
  },
  created: function () {
    const getLogin = JSON.parse(window.sessionStorage.getItem("login"));
    if (getLogin) {
      this.user = getLogin.user;
      this.token = getLogin.token;
      this.loggedin = true;
      this.getNotes();
    }
  },
});
