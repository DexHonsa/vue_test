<template>
<div class="main-container">
  <div class="login-top">
    <img src='../../img/logo.png' />
  </div>
  <div class="login-box-container">
    <div class="login-box">
      <div class="right-info-panel">
        <div class="right-info-panel-title">DataCloud</div>
        Make the most out of DataCloud with our new tutorial system. Check it out.
        <div class="login-btn">Learn More</div>
      </div>
      <div class="login-box-title">Login to DataCloud</div>
      <form @submit.prevent="onSubmitForm">
        <input type="hidden" value="something" />
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-user" /></div>
          <div class="form-group">
            <input @input="onInput" type="text" name="username" placeholder="Username" class="css-login-input-input" />
          </div>
        </div>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-lock" /></div>

          <div class="form-group">
            <input @input="onInput" name="password" placeholder="Password" type="text" class="css-login-input-input" />
          </div>
        </div>
        <button type="submit" class="login-btn">Login</button>

      </form>
      <div class="color-bottom" />
      <div class="sign-up-container">
        <div class="sign-up-title">New to DataCloud? <span onClick={this.showSignupPopup.bind(this)}>Sign Up!</span></div>
        <div class="forgot-password"><i class="fa fa-info-circle" /> Forgot your password? </div>
      </div>
    </div>
  </div>
  <div class="color-bottom">
  </div>
</div>
</template>

<script type="text/javascript">
import axios from "axios";

export default {
  name: "login",
  data: function() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    onInput: function(e) {
      this[e.target.name] = e.target.value;
    },
    onSubmitForm: function(e) {
      var data = {
        username: this.username,
        password: this.password
      };
      axios.post("http://40.65.104.52:8080/v1/auth", data).then(res => {
        window.localStorage.setItem("auth", res.data.token);
        console.log("jahaha");
        this.$router.push("/dashboard");
      });
    }
  },
  created: function() {}
};
</script>
