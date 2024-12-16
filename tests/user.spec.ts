import { token } from "morgan";

let chai_obj;
const get_chai = async () => {
    if (!chai_obj) {
        const { expect, use } = await import("chai");
        const chaiHttp = await import("chai-http");
        const chai = use(chaiHttp.default);
        chai_obj = { expect: expect, request: chai.request };
    }
    return chai_obj;
};

const multiply = (a, b) => {
    return a * b;
}

describe("user activities", () => {
    //REGISTER
    it("Register: No email", async () => {
        //no email
        //arrang

        //act
        const user = { "name": "test name", "password": "Password1@3" };
        //assert 400

    });
    it("Register: No name", async () => {
        //no name
        //arrang

        //act
        const user = { "email": "email@gmail.com", "password": "Password1@3" };

        //assert 400
    });
    it("Register: No password", async () => {
        //no pwd
        //arrang

        //act
        const user = { "name": "test name", "email": "email@gmail.com" };

        //assert 400
    });
    it("Register: successful registeration", async () => {
        //arrang

        //act
        const user = { "name": "test name", "email": "email@gmail.com", "password": "Password1@3" };

        //assert 201

    });
    it("Register: The user exist", async () => {
        //existing user
        //arrang

        //act
        const user = { "name": "test name", "email": "email@gmail.com", "password": "Password1@3" };

        //assert 401
    });
    //LOGIN
    it("Login: no email", async () => {
        //arrange

        //act
        const user = { "password": "Password1@3" };

        //assert 400

    });
    it("Login: no pwd", async () => {
        //arrange

        //act
        const user = { "email": "email@gmail.com" };
        //assert 400

    });
    it("Login: wrong email", async () => {
        //arrange

        //act
        const user = { "email": "wrongemail@gmail.com", "password": "Password1@3" };
        //assert 401

    });
    it("Login: wrong password", async () => {
        //arrange

        //act
        const user = { "email": "email@gmail.com", "password": "WrongPassword1@3" };
        //assert 401

    });
    it("Login: successful login", async () => {
        //arrange
        
        //act
        const user = { "email": "email@gmail.com", "password": "Password1@3" };
        let token = "123321";
        //assert 200
        
    });
    //GET PROFILE
    it("Get profile: unauthenticated user", async () => {
        //arrange
        
        //act
        console.log(token);
        //assert 401
        
    })
    it("Get profile: by email", async () => {
        //arrange
        
        //act
        let reqBody = {"email" : "ivan@ivan.com"};
        console.log(token);
        //assert 200
        
    })
    it("Get profile: by user id", async () => {
        //arrange
        
        //act
        console.log(token);
        //assert 200
        
    })
    //UPDATE PROFILE

});
