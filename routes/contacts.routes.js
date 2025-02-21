const router = require('express').Router();
const {ContactBuilder} = require('../models/contact');
const {saveContact, getAllContact, updateContact, getContactById} = require('../services/contact');
const {validateUserInput} = require("../utils")

//save new contact
router.post('/contacts', async(req, res) => {
    //validate input
    try {
        let errorMessage =  validateUserInput(req.body,  ['firstName', 'lastName', 'email', 'phone'])
        if (errorMessage) {
            res.status(400).send({message: errorMessage});
            return;
        }
        let contact = new ContactBuilder()
        contact
        .generateId()
        .setEmail(req.body.email)
        .setFirstName(req.body.firstName)
        .setLastName(req.body.lastName)
        .setPhone(req.body.phone).build();
        
        await saveContact(contact);
        res.send(contact);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error saving contact')
    }
 
})


//get all contacts
router.get('/contacts', async(req, res) => {
    try {
       let contacts =  await getAllContact()
       res.send(contacts)
    } catch (error) {
        console.log(error)
        res.status(500).send('Error getting contacts')
    }

})


//get a contact by firstName
router.get('/contacts/firstname/:firstName', async(req, res) => {
    const firstName = req.params.firstName;
    try {
        let contacts = await getAllContact();
        let contact = contacts.filter(c => c.firstName === firstName);
        if (contact.length === 0) {
            res.status(404).send({message: 'Contact not found'});
        } else {
            res.send(contact);
        }
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})

//get contact by lastname
router.get('/contacts/lastname/:lastName', async(req, res) => {
    const lastName = req.params.lastName;
    try {
        let contacts = await getAllContact();
        let contact = contacts.filter(c => c.lastName === lastName);
        if (contact.length === 0) {
            res.status(404).send({message: 'Contact not found'});
        } else {
            res.send(contact);
        }
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})

//get contact by id
router.get('/contacts/id/:id', async(req, res) => {
    const id = req.params.id;
    try {
       let contact = await getContactById(id);
        if (contact.length === 0) {
            res.status(404).send('Contact not found');
        } else {
            res.send(contact);
        }
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})

//delete a contact
router.delete('/contacts/:id', async(req, res) => {
    const id = req.params.id;
    try {
        //ensure contact exists
        let cnt = await getContactById(id);
        if (!cnt) {
            res.status(404).send('Contact not found');
            return;
        } 
        let contacts = await getAllContact();
        let newContactList = contacts.filter(c => c.id != id);
        updateContact(newContactList)
        res.send({message: 'Contact deleted successfully'});
        
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})


//update a contact
router.patch('/contacts/:id', async(req, res) => {
    const id = req.params.id;
    //verify input
    let errorMessage =  validateUserInput(req.body,  ['firstName', 'lastName', 'email', 'phone'])
    if (errorMessage) {
        res.status(400).send({message: errorMessage});
        return;
    }
    try {
        let contacts =await getAllContact();
        //ensure contact exists
        let cnt = contacts.find(c => c.id === id);
        if (!cnt) {
            res.status(404).send('Contact not found');
            return;
        }
        let updatedContactList = contacts.map(c => {
            if (c.id === id) {
                return {...c, ...req.body}
            }
            return c;
        })
        await updateContact(updatedContactList)
        res.send({message: 'Contact modified successfully'})
    } catch (error) {
        res.status(500).send({message: 'Error modifying contact'})
    }
})



module.exports = router;