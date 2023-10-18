// @ts-nocheck
import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jQuery.print/jQuery.print.js';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { HTTP } from 'meteor/http';
import { template } from 'lodash';
import './connectionscard.html';

Template.connectionscard.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.record = ReactiveVar();
    templateObject.record1 = ReactiveVar();
    templateObject.record2 = ReactiveVar();
    templateObject.idxRecord = ReactiveVar();
    templateObject.account = ReactiveVar();
    templateObject.connection = ReactiveVar();
    templateObject.testNote = ReactiveVar();
    templateObject.action = ReactiveVar();


    if (!FlowRouter.current().queryParams.id) templateObject.action.set('new');
    else {
        const postData = {
            id: FlowRouter.current().queryParams.id
        };
        fetch('/api/connectionsSoftwareByID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(async (result) => {
                templateObject.account.set(result[0].account_name);
                templateObject.idxRecord.set(result[0].account_name);
                templateObject.connection.set(result[0].connection_name);

                const postData1 = {
                    id: FlowRouter.current().queryParams.customerId
                };

                fetch(`/api/${templateObject.account.get().replace(' ', '')}ByID`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData1)
                })
                    .then(response => response.json())
                    .then(async (result) => {
                        templateObject.record1.set(result[0]);
                        templateObject.record.set(result[0]);
                    })
                    .catch(error => console.log(error));

                fetch(`/api/${templateObject.connection.get().replace(' ', '')}ByID`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData1)
                })
                    .then(response => response.json())
                    .then(async (result) => {
                        templateObject.record2.set(result[0]);
                    })
                    .catch(error => console.log(error));

            })
            .catch(error => console.log(error));
    }

    // Meteor.call('getConnectionSoftwareFromId', {id: FlowRouter.current().queryParams.id}, async function (error, result) {
    //     if (error) {
    //         console.log('error');
    //     } else {
    //         console.log(result[0]);
    //         templateObject.account.set(result[0].account_name);
    //         templateObject.idxRecord.set(result[0].account_name);
    //         templateObject.connection.set(result[0].connection_name);
    //         Meteor.call(`get${templateObject.account.get().replace(' ', '')}FromId`, {id: FlowRouter.current().queryParams.customerId}, async function (error, result) {
    //             if (error) {
    //                 console.log('error');
    //             } else {
    //                 templateObject.record1.set(result[0]);
    //                 templateObject.record.set(result[0]);
    //             }
    //         });
    //         Meteor.call(`get${templateObject.connection.get().replace(' ', '')}FromId`, {id: FlowRouter.current().queryParams.customerId}, async function (error, result) {
    //             if (error) {
    //                 console.log('error');
    //             } else {
    //                 templateObject.record2.set(result[0]);
    //             }
    //         });
    //     }
    // });


});

Template.connectionscard.onRendered(function () {
    const templateObject = Template.instance();
    console.log(FlowRouter.current().queryParams.tab);
    Meteor.setTimeout(function () {
        if (FlowRouter.current().queryParams.tab) {
            let tabIndex = (FlowRouter.current().queryParams.tab == 1) ? ".navIdx1" : ".navIdx2";
            let otherTab = (FlowRouter.current().queryParams.tab == 1) ? ".navIdx2" : ".navIdx1";
            this.$(tabIndex).click()
            this.$(tabIndex + ' a')[0].classList.add('active')
            this.$(otherTab + ' a')[0].classList.remove('active')
        }
    }, 300);

})

Template.connectionscard.rendered = () => {

}

Template.connectionscard.events({
    'click .navIdx1': function (event) {
        Template.instance().idxRecord.set(event.target.innerText);
        Template.instance().record.set(Template.instance().record1.get());
    },

    'click .navIdx2': function (event) {
        Template.instance().idxRecord.set(event.target.innerText);
        Template.instance().record.set(Template.instance().record2.get());
    },

    'click #testMagento': async function (event) {
        const templateObject = Template.instance();
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
        }
        var testNOtes = 'Connecting..'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting.......'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting..........'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting.............'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting................'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting...................'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting........................'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting.........................\n'
        await sleep(300)
        templateObject.testNote.set(testNOtes)

        testNOtes += "Generating Magento admin token with admin username and password ..................\n";
        templateObject.testNote.set(testNOtes)


        HTTP.call('POST', 'api/magentoAdminToken', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                'url': jQuery('#magento_base_api_url').val(),
                'username': jQuery('#magento_admin_user_name').val(),
                'password': jQuery('#magento_admin_user_password').val()
            }
        }, (error, response) => {
            // let customer_url = `${tempConnectionSoftware.base_api_url}/rest/all/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=updated_at&searchCriteria[filter_groups][0][filters][0][value]=${lstUpdateTime}&searchCriteria[filter_groups][0][filters][0][condition_type]=gt`;
            let customer_url = '/api/getMCustomers';
            if (error) {
                console.error('Error:', error);
                templateObject.testNote.set(testNOtes + '\n' + error + ':: Error Occurred While Attempting to Connect to the Magneto Server`,`Head to Connection Details and Check if Magento Server Configuration is Correct');
                swal(`Error Occurred While Attempting to Connect to the Magneto Server`, `Head to Connection Details and Check if Magento Server Configuration is Correct`, "error")
                return;
            } else {
                testNOtes = testNOtes +
                    'Successfully generated Magento Admin Token\n' +
                    'Getting Magento Customers data .....\n';
                templateObject.testNote.set(testNotes);
                token = response.data;
                let customerCount;
                HTTP.call('POST', customer_url, {
                    data: {
                        'auth': `Bearer ${token}`,
                        'url': jQuery('#magento_base_api_url').val()
                    },
                }, async (error, response) => {
                    if (error) {
                        console.error('Error:', error);
                        templateObject.testNote.set(testNotes + '\n' + error + ':: Error Occurred While Attempting to get the Magento Customers\n');
                    } else {
                        customerCount = response.data.total_count;
                        tempResponse = JSON.stringify(response.data.items);
                        token = JSON.stringify(response.data.items);
                        testNotes = testNotes +
                            '\nSuccessfully received Magento customer data: [customer count - ' + customerCount + ' ]\n' +
                            'Connecting Magento Customer to CoreEDI Customer ..... \n';
                        templateObject.testNote.set(testNotes);
                        // Process the response data here
                        // templateObject.testNote.set(JSON.stringify(response.data.items));
                        await sleep(1000);
                        testNOtes += "Connect Success!!\n"
                        templateObject.testNote.set(testNOtes)

                    }
                });
            }
        });

    },

    'click #btnTestERP': async function (event) {
        const templateObject = Template.instance();
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
        }
        var testNOtes = 'Connecting to ERP..'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP.......'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP..........'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP.............'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP................'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP...................'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP........................'
        await sleep(300)
        templateObject.testNote.set(testNOtes)
        testNOtes = 'Connecting to ERP.........................\n'
        await sleep(300)
        templateObject.testNote.set(testNOtes)

        testNOtes += "Get TureERP Customers ..................\n";
        await sleep(1000)
        templateObject.testNote.set(testNOtes)
        HTTP.call('POST', jQuery('#trueerp_base_url').val() + '/TCustomer', {
            headers: {
                'Username': jQuery('#trueerp_user_name').val(),
                'Password': jQuery('#trueerp_password').val(),
                'Database': jQuery('#trueerp_database').val(),
            }
        }, (error, response) => {
            // responseCount++;
            if (error) {
                console.error('Error:', error);
                testNOtes += `An Error Occurred While Adding a Customer to TrueERP\n`
                templateObject.testNote.set(testNOtes);
            }
            else {
                testNOtes += `1 Customer Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
                templateObject.testNote.set(testNOtes);
            }
            if (responseCount == customerCount) {
                let tempDate = new Date();
                let dateString =
                    tempDate.getUTCFullYear() + "/" +
                    ("0" + (tempDate.getUTCMonth() + 1)).slice(-2) + "/" +
                    ("0" + tempDate.getUTCDate()).slice(-2) + " " +
                    ("0" + tempDate.getUTCHours()).slice(-2) + ":" +
                    ("0" + tempDate.getUTCMinutes()).slice(-2) + ":" +
                    ("0" + tempDate.getUTCSeconds()).slice(-2);
                let args = {
                    id: selConnectionId,
                    last_ran_date: dateString
                };
                fetch(`/api/updateLastRanDate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(args)
                })
                    .then(response => response.json())
                    .then(async (result) => {
                        console.log(result);
                    })
                    .catch((err) => console.log(err))
                fetchProduct(templateObject, lstUpdateTime, tempConnectionSoftware.base_api_url, tempAccount, token, selConnectionId, text);
            }
        });

    },

    'click #btnFilterOption': async function (event) {
        jQuery('#_filterOptionModal').modal('toggle');
    },

    'click #saveMagento': function () {
        let magentoData = {};
        magentoData.id = FlowRouter.current().queryParams.customerId;
        magentoData.company_name = jQuery('#magento_company_name').val();
        magentoData.enabled = jQuery('#magento_enabled_toggle').is(':Checked');
        magentoData.consumer_key = jQuery('#magento_consumer_key').val();
        magentoData.consumer_secret = jQuery('#magento_consumer_secret').val();
        magentoData.admin_user_name = jQuery('#magento_admin_user_name').val();
        magentoData.admin_user_password = jQuery('#magento_admin_user_password').val();
        magentoData.base_api_url = jQuery('#magento_base_api_url').val();
        magentoData.access_token = jQuery('#magento_access_token').val();
        magentoData.access_token_secret = jQuery('#magento_access_token_secret').val();
        magentoData.synch_page_size = 100;
        magentoData.sales_type = 'test';
        magentoData.customer_identified_by = 'test';
        magentoData.product_name = 'test';
        magentoData.print_name_to_short_description = 'test';
        // magentoData.synch_page_size = jQuery('#magento_sync_page_size').val();
        // magentoData.sales_type = jQuery('#magento_sType')[0].selectedIndex;
        // magentoData.customer_identified_by = jQuery('#magento_cIdentify')[0].selectedIndex;
        // magentoData.product_name = jQuery('#magento_pName')[0].selectedIndex;
        // magentoData.print_name_to_short_description = jQuery('#magento_print_description').is(':Checked');
        // console.log(magentoData);
        // Meteor.call('updateMagento', magentoData, (err, result) => {
        //     if (err) console.log(err)
        //     else {
        //         if (result == "success") swal("",'Magento Successfully Updated',"success");
        //     }
        // })
        fetch('/api/updateMagento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(magentoData)
        })
            .then(response => response.json())
            .then(async (result) => {
                if (result == 'success')
                    swal("", 'Magento Successfully Updated', "success");
            })
            .catch(error => console.log(error));
    },

    'click #saveTrueERP': function () {
        let trueERPData = {};
        trueERPData.user_name = jQuery('#trueerp_user_name').val();
        trueERPData.password = jQuery('#trueerp_password').val();
        trueERPData.database = jQuery('#trueerp_database').val();
        trueERPData.base_url = jQuery('#trueerp_base_url').val();
        trueERPData.id = jQuery('#trueerp_id').val();
        trueERPData.enabled = jQuery('#trueerp_enabled').is(':Checked');
        // Meteor.call('updateTrueERP', trueERPData, (err, result) => {
        //     if (err) console.log(err)
        //     else {
        //         if (result == "success") swal("",'TrueERP Successfully Updated',"success");
        //     }
        // })
        fetch('/api/updateTrueERP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trueERPData)
        })
            .then(response => response.json())
            .then(async (result) => {
                if (result == 'success')
                    swal("", 'TrueERP Successfully Updated', "success");
            })
            .catch(error => console.log(error));
    },
});

Template.connectionscard.helpers({
    record: () => {
        return Template.instance().record.get();
    },
    action: () => {
        return Template.instance().action.get();
    },
    idxRecord: () => {
        return Template.instance().idxRecord.get();
    },
    account: () => {
        return Template.instance().account.get();
    },
    connection: () => {
        return Template.instance().connection.get();
    },
    testNote: () => {
        return Template.instance().testNote.get();
    }
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});

