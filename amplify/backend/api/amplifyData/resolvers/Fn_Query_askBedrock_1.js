export function request(ctx) {
    const { websiteURL } = ctx.args;
    
    // Validate input to avoid empty requests
    if (!websiteURL) {
        return {
            error: "websiteURL is required for risk analysis."
        };
    }

    const prompt = `Analyze the website URL provided: ${websiteURL}. Identify risks across the following categories: Cybersecurity, Reputational, Operational, Physical, and Financial. Provide a detailed report for each category.`;

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
    // Directly parse the response without try/catch
    const parsedBody = JSON.parse(ctx.result.body);
    if (!parsedBody || !parsedBody.content || !parsedBody.content[0]) {
        return {
            body: "No valid response received from Bedrock API."
        };
    }
    
    return {
        body: parsedBody.content[0].text
    };
}