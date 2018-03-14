declare namespace Jira {

    interface ApplicationProperty {
        id: string,
        key: string,
        value: string,
        name: string,
        desc: string,
        type: string,
        defaultValue: string
        example?: string,
        allowedValues?: Array<string>
    }

    interface EntityProperty {
        self?: string;
        key: string;
        value: any;
    }

    interface EntityPropertyKey {
        self: string;
        key: string;
    }

    interface EntityPropertiesKeys {
        keys: Array<EntityPropertyKey>
    }

    interface UserLight {
        self: string;
        name: string;
        displayName: string;
        active: boolean;
    }

    interface User {
        self: string;
        name: string;
        displayName: string;
        active: boolean;
        key: string;
        accountId?: string;
        emailAddress: string;
        avatarUrls: AvatarUrls;
        timeZone: string;
        groups: Groups;
        applicationRoles: ApplicationRoles;
    }

    interface Users {
        size: number;
        items: Array<User | UserLight>
    }

    interface GroupLight {
        self: string;
        name: string;
    }

    interface Group {
        self: string;
        name: string;
        users: Users;
    }

    interface Groups {
        size: number;
        items: Array<Group | GroupLight>;
    }

    interface ApplicationRoleLight {
        self: string;
        name: string;
    }

    interface ApplicationRole {
        self: string;
        key: string,
        groups: Array<string>,
        name: string;
        defaultGroups: Array<string>,
        selectedByDefault: boolean,
        defined: boolean,
        numberOfSeats: number,
        remainingSeats: number,
        userCount: number,
        userCountDescription: number,
        hasUnlimitedSeats: boolean,
        platform: boolean
    }

    interface ApplicationRoles {
        size: number;
        items: Array<ApplicationRole | ApplicationRoleLight>;
    }

    interface Component {
        self: string;
        id: string;
        name: string;
        description: string;
        lead: User;
        assigneeType: string;
        assignee: User;
        realAssigneeType: string;
        realAssignee: User;
        isAssigneeTypeValid: boolean;
        project: string;
        projectId: number;
    }

    interface AvatarUrls {
        '48x48': string;
        '24x24': string;
        '16x16': string;
        '32x32': string;
    }

    interface ProjectCategory {
        self: string;
        id: string;
        name: string;
        description: string;
    }

    interface IssueType {
        self: string;
        id: string;
        description: string;
        iconUrl: string;
        name: string;
        subtask: boolean;
        avatarId: number;
    }

    interface Version {
        self: string;
        id: string;
        description: string;
        name: string;
        archived: boolean;
        released: boolean;
        releaseDate: string;
        overdue: boolean;
        userReleaseDate: string;
        projectId: number;
    }

    interface Project {
        self: string;
        id: string;
        key: string;
        description: string;
        lead: User;
        components: Array<Component>;
        issueTypes: Array<IssueType>;
        url: string;
        email: string;
        assigneeType: string;
        versions: Array<Version>;
        name: string;
        roles: object;
        avatarUrls: AvatarUrls;
        projectCategory: ProjectCategory;
        simplified: boolean;
    }
}