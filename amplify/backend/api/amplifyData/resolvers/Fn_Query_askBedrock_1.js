export function request(ctx) {
    const { websiteURL } = ctx.args;
    
    if (!websiteURL) {
        return {
            error: "Error: websiteURL is required for risk analysis."
        };
    }

    const prompt = `Analyze the website URL provided: ${websiteURL}. Identify risks across Cybersecurity, Reputational, Operational, Physical, and Financial categories. Provide a detailed report.`;

    return {
        resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [{ type: "text", text: `\n\nHuman: ${prompt}\n\nAssistant:` }]
                    }
                ]
            })
        }
    };
}

export function response(ctx) {
    const parsedBody = JSON.parse(ctx.result.body);

    // Ensure valid response structure without optional chaining
    if (!parsedBody || !parsedBody.content || parsedBody.content.length === 0) {
        return {
            body: "Error: Invalid response received from Bedrock."
        };
    }

    return {
        body: parsedBody.content[0].text
    };
}
