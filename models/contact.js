const {generateId}  = require("../utils")
class Contact {
    constructor(builder) {
        this.id = builder.id;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.phone = builder.phone;
    }

}


class ContactBuilder {
    constructor(){}
    
    generateId(){
        let id = generateId("CN", 10000);
        this.id=id;
        return this;
    }
    setFirstName(firstName){
        this.firstName =firstName
        return this;
    }
    setLastName(lastName) {
        this.lastName=lastName;
        return this
    }
    setEmail(email){
        this.email=email;
        return this;
    }
    setPhone(phone){
        this.phone=phone;
        return this;
    }
    build(){
        return new Contact(this);
    }
}

module.exports= {Contact, ContactBuilder}