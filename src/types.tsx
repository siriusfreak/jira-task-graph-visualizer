export interface Issue {
    key: string;
    fields: {
        status: {
            name: string; // Include the status name
        };
        epicName: string; // Epic Link
        summary: string;
        parent?: { key: string };
        issueLinks: Array<{
            type: { name: string };
            inwardIssue?: { key: string };
            outwardIssue?: { key: string };
        }>;
        issueType: {name: string}
    };
    self: string;
}
