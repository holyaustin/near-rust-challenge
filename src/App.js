import React from "react";
import "regenerator-runtime/runtime";
import getConfig from "./config";
import "./global.css";
import { login, logout } from "./utils";

const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  const [greeting, set_greeting] = React.useState();

  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  const [showNotification, setShowNotification] = React.useState(false);

  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>
          Welcome to NEAR Spring Challenge
        </h1>

        <p style={{ textAlign: "center", marginTop: "15em" }}>
          <button onClick={login}>Connect Wallet</button>
        </p>
      </main>
    );
  }

  return (
    <>
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Disconnect Wallet
      </button>
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: "white",
             
            }}
          >
            {greeting}
          </label>
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const { fieldset, greeting } = event.target.elements;

            const newGreeting = greeting.value;

            fieldset.disabled = true;

            try {
              const res = await window.contract.get_username({
                name: newGreeting,
              });

              set_greeting(res);
            } catch (e) {
              alert(
                "Something went wrong! " +
                  "Maybe you need to sign out and back in? " +
                  "Check your browser console for more info."
              );
              throw e;
            } finally {
              fieldset.disabled = false;
            }

            setShowNotification(true);

            setTimeout(() => {
              setShowNotification(false);
            }, 3000);
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: "block",
                color: "var(--white)",
                marginBottom: "0.5em",
                fontSize: "44px",
              }}
            >
              Enter a name
            </label>
            <div style={{ display: "flex" }}>
              <input
                autoComplete="off"
                defaultValue={greeting}
                id="greeting"
                onChange={(e) => setButtonDisabled(e.target.value === greeting)}
                style={{ flex: 1, fontSize: "44px" }}
              />
              </div>
              <div align="center">
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: "60px", marginTop: "40px" }}
              >
                Submit 
              </button>
            </div>
          </fieldset>
        </form>
      </main>
      {showNotification && <Notification />}
    </>
  );
}

function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      called method: 'get_username' in contract:
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
