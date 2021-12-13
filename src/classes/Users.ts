import User from "./User";


class Users {

    public users: User[];
    private availableColors: TUserColor[];

    constructor() {
        this.users = [];
        this.availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    }

    public addUser(user: User): boolean {
        if (!this.getUser(user.uuid)) this.users.push(user);
        else return false;
        this.assignColor(user);
        return true;
    }

    public removeUser(user: User): User[] {
        this.availableColors.unshift(user.color);
        return this.users.splice(this.users.indexOf(user), 1);
    }

    public removeUserByUUID(uuid: string): User[] {
        return this.users.splice(this.users.findIndex(user => user.uuid === uuid), 1);
    }

    public getUser(uuid: string): User | null {
        return this.users.find(user => user.uuid === uuid) ?? null;
    }

    public assignColor(user: User): void {
        user.color = this.availableColors.shift() ?? '';
    }

    public checkAlive(): void {
        this.users.forEach(user => {
            if (!user.isAlive()) {
                console.log(`Removed user ${user.username} due to inactivity`);
                this.removeUser(user);
            }
        });
    }

    get playerCount() {
        return this.users.length;
    }

}


export default Users;