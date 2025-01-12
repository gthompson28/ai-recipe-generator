import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const urls = formData.get("urls")?.toString().split(",") || [];
      const email = formData.get("email")?.toString();

      // Perform the risk analysis request
      const { data, errors } = await amplifyClient.queries.askBedrock({
        urls: urls,
      });

      if (!errors) {
        setResult(data?.body || "No risk data returned");

        // Send report via email using the modified backend
        await amplifyClient.mutations.sendRiskReport({
          email: email,
          report: data.body,
        });

        alert("Risk report has been sent to your email!");
      } else {
        console.log(errors);
      }
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          AI-Driven Church <br />
          <span className="highlight">Risk Management Tool</span>
        </h1>
        <p className="description">
          Enter website URLs and your email address to receive a detailed risk analysis report.
        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="urls"
            name="urls"
            placeholder="https://example.com, https://anotherchurch.org"
          />
          <input
            type="email"
            className="wide-input"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
          <button type="submit" className="search-button">
            Analyze Risks & Send Report
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;
