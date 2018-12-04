import groups from './mocks/groups'
import issueCreateMeta from './mocks/issueCreateMeta'
import projects from './mocks/projects'
import users from './mocks/users'

const answerDelay = 200;

function response(response) {
    return new Promise(resolve => setTimeout(() => resolve(response), answerDelay));
}

export const isMock = true;

export function get(url) {
    console.log(`GET ${url}`);
    return new Promise(resolve => resolve([]))
}

export function del(url) {
    console.log(`DELETE ${url}`);
    return new Promise(resolve => resolve([]))
}

export function put(url) {
    console.log(`PUT ${url}`);
    return new Promise(resolve => resolve([]))
}

export function post(url) {
    console.log(`POST ${url}`);
    return new Promise(resolve => resolve([]))
}

export const getGroupsForPicker = query => response({
    ...groups,
    groups: groups.groups.filter(group => group.name.indexOf(query) >= 0)
});

export const findUsersAndGroups = query => response( {
    groups: {
        groups: groups.groups.filter(group => group.name.indexOf(query) >= 0)
    },
    users: {
        users: users
            .filter(user => queryMatchesUser(query, user))
            .map(user => ({
                key: user.key,
                accountId: user.accountId,
                displayName: user.displayName,
                name: user.name,
                avatarUrl: user.avatarUrls['24x24']
            }))
    },
});

export const getUsersFromGroup = groupname => response({
    values: users.filter(user => {
        if (user.key === 'admin') {
            return (groupname.indexOf('admin') !== -1);
        } else {
            return (groupname === 'jira-servicedesk-users');
        }
    })
});

export const getProject = projectKeyOrId => response(projects.filter(project => project.id === projectKeyOrId)[0]);
export const getProjects = () => response(projects);

export const getUserByUserKey = userKey => response(users.filter(user => user.key === userKey)[0]);
export const getUserByAccountId = accountId => response(users.filter(user => user.accountId === accountId)[0]);
export const getUsers = userQuery => response(users.filter(user => queryMatchesUser(userQuery, user)));

function queryMatchesUser(query, user) {
    return user.key.toUpperCase().indexOf(query.toUpperCase()) >= 0
        || user.name.toUpperCase().indexOf(query.toUpperCase()) >= 0
        || user.displayName.toUpperCase().indexOf(query.toUpperCase()) >= 0
}

export const getIssueCreateMeta = () => response(issueCreateMeta);
