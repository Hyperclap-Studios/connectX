import User from "./User";


class Users {

    public users: User[];

    constructor() {
        this.users = [];
    }

    public addUser(user: User): void {
        if (!this.getUser(user.uuid)) this.users.push(user);
    }

    public removeUser(user: User): void {
        this.users.splice(this.users.indexOf(user), 1);
    }

    public removeUserByUUID(uuid: string): void {
        this.users = this.users.splice(this.users.findIndex(user => user.uuid === uuid), 1);
    }

    public getUser(uuid: string): User | null {
        return this.users.find(user => user.uuid === uuid) ?? null;
    }

    public checkAlive(): void {
        this.users.forEach(user => {
            if (!user.isAlive()) {
                console.log(`Removed user ${user.username} due to inactivity`);
                this.removeUser(user);
            }
        });
    }

}


export default Users;