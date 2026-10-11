function FirstUserSetupSection({
  username,
  password,
  setUsername,
  setPassword,
  saveUser,
  setError,
  setSuccessMessage,
  handleApiError,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    saveUser("")
      .then(() => {
        setError("");
        setSuccessMessage("First ADMIN user created successfully. Please log in.");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  return (
    <section>
      <h2>First User Setup</h2>

      <p className="hint">
        No users exist yet. Create the first ADMIN account to start using SyncERPal.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Role: </label>
          <input type="text" value="ADMIN" disabled />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength="6"
          />
        </div>

        <button type="submit">Create First ADMIN User</button>
      </form>
    </section>
  );
}

export default FirstUserSetupSection;