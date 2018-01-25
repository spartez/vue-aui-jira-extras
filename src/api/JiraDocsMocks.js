const projects = [
    {
        "expand": "description,lead,issueTypes,url,projectKeys",
        "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10705",
        "id": "10705",
        "key": "A2",
        "name": "Agility 2",
        "avatarUrls": {
            "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10705&avatarId=10846",
            "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10705&avatarId=10846",
            "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10705&avatarId=10846",
            "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10705&avatarId=10846"
        },
        "projectTypeKey": "software",
        "simplified": false
    },
    {
        "expand": "description,lead,issueTypes,url,projectKeys",
        "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10706",
        "id": "10706",
        "key": "AG",
        "name": "Agility 22",
        "avatarUrls": {
            "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10706&avatarId=10846",
            "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10706&avatarId=10846",
            "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10706&avatarId=10846",
            "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10706&avatarId=10846"
        },
        "projectTypeKey": "software",
        "simplified": false
    }
];

export function get(url, payload) {
    let response;
    if (url === '/rest/api/2/project') {
        response = projects
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(response, 100))
    })
}
