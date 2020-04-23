import {
    Stitch,
    StitchAppClient,
    RemoteMongoClient,
    RemoteMongoCollection,
    UserPasswordAuthProviderClient,
    UserPasswordCredential
} from "mongodb-stitch-browser-sdk";
import CoopCareApiInterface from "./coopCareApiInterface";
import { Client } from "../models/client";
import { ObjectID } from "bson";

export default class StitchApi implements CoopCareApiInterface {
    stitch: StitchAppClient;
    mongodb: RemoteMongoClient;
    clients: RemoteMongoCollection<Client>;

    constructor(stitchApp: string, database: string, collection: string) {
        this.stitch = Stitch.initializeDefaultAppClient(stitchApp);
        this.mongodb = this.stitch.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        this.clients = this.mongodb.db(database).collection(collection);
    }

    get isLoggedIn() {
        return this.stitch.auth.isLoggedIn;
    }
    get user() {
        return this.stitch.auth.user;
    }
    get userId() {
        return this.user?.id || "";
    }
    get username() {
        return this.user?.profile.email || "";
    }
    login(username: string, password: string) {
        const credential = new UserPasswordCredential(username, password);
        return this.stitch.auth
            .loginWithCredential(credential)
            .then(() => undefined);
    }
    logout() {
        return this.stitch.auth.logout();
    }
    registerUser(username: string, password: string) {
        const epclient = this.stitch.auth.getProviderClient(
            UserPasswordAuthProviderClient.factory
        );
        return epclient.registerWithEmail(username, password);
    }
    confirmUser(token: string, tokenId: string) {
        const epclient = this.stitch.auth.getProviderClient(
            UserPasswordAuthProviderClient.factory
        );
        return epclient.confirmUser(token, tokenId);
    }

    createClient(client: Client) {
        return this.clients.insertOne(client).then(() => client);
    }
    deleteClient(client: Client) {
        return this.clients.deleteOne(client).then(() => undefined);
    }
    deleteAllClients() {
        return this.clients.deleteMany({}).then(() => undefined);
    }
    getAllClients(): Promise<Client[]> {
        return (
            this.clients
                // limiting the fetched properties to name and leftAt causes bugs
                // where details of selected client cannot be displayed in client view
                .find({}, {})
                .toArray()
                .then(data => {
                    return Client.fromObject(data) as Client[];
                })
        );
    }
    getClient(id: ObjectID) {
        return this.clients
            .find({ _id: id }, {})
            .first()
            .then(data => {
                return Client.fromObject(data) as Client;
            });
    }
    saveClient(client: Client) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        client.user_id = this.user?.id || "";
        return this.clients
            .findOneAndReplace({ _id: client._id }, client)
            .then(() => client);
    }
}
