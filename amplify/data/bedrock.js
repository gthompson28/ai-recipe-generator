import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' }); // Confirm this region matches your SES setup

export async function request(ctx) {
    const { urls = [] } = ctx.args;
  
    if (!urls.length) {
        throw new Error("No URLs provided for risk analysis.");
    }

    const prompt = `Analyze the following websites for risk factors across the five categories: Cybersecurity, Reputational, Operational, Physical, and Financial. Websites: ${urls.join(", ")}. Provide a detailed summary highlighting specific risks in each category.`;
  
    return {
        resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [{ type: "text", text: `\n\nHuman: ${prompt}\n\nAssistant:` }],
                    },
                ],
            }),
        },
    };
}

export async function response(ctx) {
    const parsedBody = JSON.parse(ctx.result.body);
    if (!parsedBody.content || !parsedBody.content[0].text) {
        throw new Error("Invalid response from Bedrock API");
    }
    return { body: parsedBody.content[0].text };
}

export async function sendRiskReport(ctx) {
    const { email, report } = ctx.args;

    if (!email || !report) {
        throw new Error("Email or report content missing.");
    }

    const params = {
        Source: "support@mindshiftcreators.com",  // Replace with your SES-verified email
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: "Church Risk Management Report" },
            Body: { Text: { Data: report } },
        },
    };

    try {
        await ses.sendEmail(params).promise();
        return { body: "Email sent successfully!" };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { body: `Error sending email: ${error.message}` };
    }
}
