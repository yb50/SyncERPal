function LoginSection({
  loggedInUser,
  loginUsername,
  loginPassword,
  setLoginUsername,
  setLoginPassword,
  login,
  logout,
  setError,
  setSuccessMessage,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    login()
      .then(() => {
        setError("");
        setSuccessMessage("Logged in successfully.");
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.message);
      });
  }

  if (loggedInUser) {
    return (
      <div className="login-panel">
        <p>
          Logged in as <strong>{loggedInUser.username}</strong> (
          {loggedInUser.role})
        </p>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-panel">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={loginUsername}
            onChange={(event) => setLoginUsername(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginSection;