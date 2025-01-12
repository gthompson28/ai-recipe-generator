import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' }); // Replace with your region

export async function request(ctx) {
    const { urls = [] } = ctx.args;
  
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
                        content: [
                            {
                                type: "text",
                                text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                            },
                        ],
                    },
                ],
            }),
        },
    };
}

export function response(ctx) {
    const parsedBody = JSON.parse(ctx.result.body);
    const resultText = parsedBody.content[0].text;
    return {
        body: resultText
    };
}

// New function to send risk report via SES
export async function sendRiskReport(ctx) {
    const { email, report } = ctx.args;

    const params = {
        Source: "your-verified-email@yourchurchdomain.com",
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Subject: { Data: "Your Church Risk Management Report" },
            Body: {
                Text: { Data: report },
            },
        },
    };

    try {
        await ses.sendEmail(params).promise();
        console.log("Email sent successfully!");
        return { body: "Email sent successfully!" };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { body: `Failed to send email: ${error.message}` };
    }
}
