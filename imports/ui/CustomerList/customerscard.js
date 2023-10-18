// @ts-nocheck
import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jQuery.print/jQuery.print.js';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import './customerscard.css';
import './customerscard.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from "moment";
import { HTTP } from 'meteor/http';


Template.customerscard.onCreated(function () {
    const templateObject = Template.instance();

    templateObject.listNumber = new ReactiveVar();
    templateObject.currentTab = new ReactiveVar("tab-1")
    templateObject.transNote = new ReactiveVar("")
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.todayDate = new ReactiveVar(moment(new Date()).format("DD/MM/YYYY"));
    templateObject.selConnectionId = new ReactiveVar(-1);
    templateObject.connectionType = new ReactiveVar("");
    var today = new Date();
    templateObject.todayDate.set(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
    templateObject.getDataTableList = function (data) {
        let dataList = [
            data.ID || '',
            data.DBName || '-',
            data.AccName || '',
            data.ConnName || '',
            '<span style="display:none;">' + (data.LastRanDate != '' ? moment(data.LastRanDate).format("YYYY/MM/DD") : data.LastRanDate) + '</span>' + (data.LastRanDate != '' ? moment(data.LastRanDate).format("DD/MM/YYYY") : data.LastRanDate),
            '<span style="display:none;">' + (data.LastRanDate != '' ? moment(data.LastRanDate).format("HH:mm") : data.LastRanDate) + '</span>' + (data.LastRanDate != '' ? moment(data.LastRanDate).format("HH:mm") : data.LastRanDate),
            data.RunCycle ? data.RunCycle : '',
            '<span style="display:none;">' + (data.NextRunDate != '' ? moment(data.NextRunDate).format("YYYY/MM/DD") : data.NextRunDate) + '</span>' + (data.NextRunDate != '' ? moment(data.NextRunDate).format("DD/MM/YYYY") : data.NextRunDate),
            '<span style="display:none;">' + (data.NextRunDate != '' ? moment(data.NextRunDate).format("HH:mm") : data.NextRunDate) + '</span>' + (data.NextRunDate != '' ? moment(data.NextRunDate).format("HH:mm") : data.NextRunDate),
            data.Enabled ? 'Y' : 'N'
        ];
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: 'ID', class: 'colID', active: false, display: true, width: "80" },
        { index: 1, label: "Database Name", class: "colDatabaseName", active: true, display: true, width: "200" },
        { index: 2, label: "Accounting Software", class: "colAccountingSoftware", active: true, display: true, width: "200" },
        { index: 3, label: "Connection Software", class: "colConnectionSoftware", active: true, display: true, width: "200" },
        { index: 4, label: "Last Run Date", class: "colLastScheduledJobRanOn", active: true, display: true, width: "100" },
        { index: 5, label: "Last Run Time", class: "colLastScheduledJobRanOn", active: true, display: true, width: "100" },
        { index: 6, label: "Run Every", class: "colRunEvery", active: true, display: true, width: "110" },
        { index: 7, label: "Next Run Date", class: "colNextScheduledRunAt", active: true, display: true, width: "100" },
        { index: 8, label: "Next Run Time", class: "colNextScheduledRunAt", active: true, display: true, width: "100" },
        { index: 9, label: "Enabled", class: "colEnabled", active: true, display: true, width: "120" },
    ];
    templateObject.tableheaderrecords.set(headerStructure);

});

Template.customerscard.events({

    "click .mainTab": function (event) {
        const tabID = $(event.target).data('id');
        Template.instance().currentTab.set(tabID);
    },

    "click #saveCustomer": function (event) {
        const customerData = {
            companyName: $('#edtCustomerCompany').val(),
            email: $("#edtCustomerEmail").val(),
            firstName: $("#edtFirstName").val(),
            middleName: $("#edtMiddleName").val(),
            lastName: $("#edtLastName").val(),
            phone: $('#edtCustomerPhone').val(),
            mobile: $('#edtCustomerMobile').val(),
            fax: $('#edtCustomerFax').val(),
            skypeID: $("#edtCustomerSkypeID").val(),
            website: $("#edtCustomerWebsite").val(),
            logon_name: $("#logonName").val(),
            logon_password: $("#logonPassword").val()
        }

        // Meteor.call('addCustomer', customerData, (err, result) => {
        //     if (err) console.log(err)
        //     else {
        //         if (result == "success") swal("",'successfully added!', "success");
        //         else if (result == 'email used') {
        //             swal("","Email address is already using.... \n Please use another Email address.","warning");
        //             $('#edtCustomerEmail').focus();   
        //         }
        //     }
        // })

        fetch('/api/addCustomer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        })
            .then(response => response.json())
            .then(async (result) => {
                if (result == 'success')
                    swal("", 'successfully added!', "success")
                else if (result == 'email used') {
                    swal("", "Email address is already using.... \n Please use another Email address.", "warning");
                    $('#edtCustomerEmail').focus();
                }
            })
            .catch(error => console.log(error));
    },

    "click #updateCustomer": function (e) {
        const customerData = {
            id: FlowRouter.current().queryParams.id,
            companyName: $('#edtCustomerCompany').val(),
            email: $("#edtCustomerEmail").val(),
            firstName: $("#edtFirstName").val(),
            middleName: $("#edtMiddleName").val(),
            lastName: $("#edtLastName").val(),
            phone: $('#edtCustomerPhone').val(),
            mobile: $('#edtCustomerMobile').val(),
            fax: $('#edtCustomerFax').val(),
            skypeID: $("#edtCustomerSkypeID").val(),
            website: $("#edtCustomerWebsite").val(),
            logon_name: $("#logonName").val(),
            logon_password: $("#logonPassword").val()
        }

        // Meteor.call('updateCustomer', customerData, (err, result) => {
        //     if (err) console.log(err)
        //     else {
        //         if (result == "success") swal("",'Customer Successfully Updated',"success");
        //     }
        // })

        fetch('/api/updateCustomer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        })
            .then(response => response.json())
            .then(async (result) => {
                if (result == 'success')
                    swal("", 'Customer Successfully Updated', "success");
            })
            .catch(error => console.log(error));
    },

    "click .btnDelete": function () {
        if (FlowRouter.current().queryParams.id) {
            // Meteor.call('reomoveCustomer', FlowRouter.current().queryParams, (err, result) => {
            //     if (err) console.log(err)
            //     else {
            //         swal("",result,"error")
            //     }
            // })

            const postData = {
                id: FlowRouter.current().queryParams.id
            }

            fetch('/api/removeCustomer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
                .then(response => response.json())
                .then(async (result) => {
                    if (result == 'success')
                        swal("", result, "success");
                })
                .catch(error => console.log(error));
        }
    },

    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    },

    'click .connectionTab': function () {
        Template.instance().currentTab.set("tab-3");
    },

    'click .customerTab': function () {
        Template.instance().currentTab.set("tab-1");
    },

    'click #setFrequency': function () {
        let selConnectionId = Template.instance().selConnectionId.get();
        let connectionType = Template.instance().connectionType.get();
        if (selConnectionId == -1) {
            swal("", 'Please Select Connection Data', "error")
            return;
        }
        jQuery('#frequencyModal').modal('toggle');
    },

    'click input[name="frequencyRadio"]': function (event) {
        if (event.target.id == "frequencyMonthly") {
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyWeekly") {
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyDaily") {
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyOnetimeonly") {
            document.getElementById("oneTimeOnlySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
        } else {
            $("#copyFrequencyModal").modal('toggle');
        }
    },
    'click input[name="settingsMonthlyRadio"]': function (event) {
        if (event.target.id == "settingsMonthlyEvery") {
            $('.settingsMonthlyEveryOccurence').attr('disabled', false);
            $('.settingsMonthlyDayOfWeek').attr('disabled', false);
            $('.settingsMonthlySpecDay').attr('disabled', true);
        } else if (event.target.id == "settingsMonthlyDay") {
            $('.settingsMonthlySpecDay').attr('disabled', false);
            $('.settingsMonthlyEveryOccurence').attr('disabled', true);
            $('.settingsMonthlyDayOfWeek').attr('disabled', true);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="dailyRadio"]': function (event) {
        if (event.target.id == "dailyEveryDay") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyWeekdays") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyEvery") {
            $('.dailyEveryXDays').attr('disabled', false);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },

    'click #runNow': function () {
        var transNOtes = 'connecting....'
        let templateObject = Template.instance();
        let selConnectionId = templateObject.selConnectionId.get();
        let lstUpdateTime = new Date();
        let tempConnection;
        let tempResponse;
        let text = "";
        let token;
        let connectionType;
        let tempConnectionSoftware;
        let tempAccount;
        if (selConnectionId == -1) {
            swal("", 'Please Select Connection Data', "error")
            return;
        }
        templateObject.transNote.set(transNOtes);
        const postData = {
            id: selConnectionId
        };
        fetch('/api/connectionsByID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(async (result) => {
                lstUpdateTime = moment(result[0].last_ran_date).format("YYYY-MM-DD HH:mm:ss");
                tempConnection = result[0];
                console.log('tempConnection', tempConnection)
                transNOtes = transNOtes +
                    '\nconnected to CoreEDI database:' +
                    ' { customerID: ' + tempConnection.customer_id + ', DB_Name: ' + tempConnection.db_name + '}';
                templateObject.transNote.set(transNOtes);
                const postData = {
                    id: tempConnection.connection_id
                };
                fetch('/api/softwareByID', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                    .then(response => response.json())
                    .then(async (result) => {
                        connectionType = result[0].name.toLowerCase();
                        templateObject.connectionType.set(connectionType);
                        transNOtes = transNOtes +
                            '\nSet Up Connectiopn Software\n' +
                            'Connecting to ' + templateObject.connectionType.get() + '............';
                        templateObject.transNote.set(transNOtes);
                        if (connectionType == "magento") {
                            const postData = {
                                id: tempConnection.customer_id
                            };
                            fetch('/api/MagentoByID', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(postData)
                            })
                                .then(response => response.json())
                                .then(async (result) => {
                                    tempConnectionSoftware = result[0];
                                    console.log('tempConnectionSoftware', tempConnectionSoftware)
                                    transNOtes = transNOtes +
                                        '\nGet Matento access permistion\n' +
                                        'Authenticating to ' + templateObject.connectionType.get() + ': ' + result[0].base_api_url + ' ............';
                                    templateObject.transNote.set(transNOtes);
                                    HTTP.call('POST', 'api/magentoAdminToken', {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        data: {
                                            'url': tempConnectionSoftware.base_api_url,
                                            'username': `${tempConnectionSoftware.admin_user_name}`,
                                            'password': `${tempConnectionSoftware.admin_user_password}`
                                        }
                                    }, (error, response) => {
                                        // let customer_url = `${tempConnectionSoftware.base_api_url}/rest/all/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=updated_at&searchCriteria[filter_groups][0][filters][0][value]=${lstUpdateTime}&searchCriteria[filter_groups][0][filters][0][condition_type]=gt`;
                                        let customer_url = '/api/getMCustomers';
                                        if (error) {
                                            console.error('Error:', error);
                                            templateObject.transNote.set(transNOtes + '\n' + error + ':: Error Occurred While Attempting to Connect to the Magneto Server`,`Head to Connection Details and Check if Magento Server Configuration is Correct');
                                            swal(`Error Occurred While Attempting to Connect to the Magneto Server`, `Head to Connection Details and Check if Magento Server Configuration is Correct`, "error")
                                            return;
                                        } else {
                                            console.log(response.data)
                                            token = response.data;
                                            transNOtes = transNOtes +
                                                '\nSuccessfully generated Magento Admin Token\n' +
                                                'Getting Magento Customers data .....';
                                            templateObject.transNote.set(transNOtes);
                                            let customerCount;
                                            HTTP.call('POST', customer_url, {
                                                data: {
                                                    auth: `Bearer ${token}`,
                                                    url: tempConnectionSoftware.base_api_url
                                                }
                                            }, (error, response) => {
                                                if (error) {
                                                    console.error('Error:', error);
                                                    templateObject.transNote.set(transNOtes + '\n' + error + ':: Error Occurred While Attempting to get the Magento Customers\n');
                                                } else {
                                                    customerCount = response.data.total_count;
                                                    tempResponse = response.data.items;
                                                    token = response.data;
                                                    transNOtes = transNOtes +
                                                        '\nSuccessfully received Magento customer data: [customer count - ' + customerCount + ' ]\n' +
                                                        'Connecting Magento Customer to CoreEDI Customer ..... \n';
                                                    templateObject.transNote.set(transNOtes);
                                                    // Process the response data here
                                                    // templateObject.transNote.set(JSON.stringify(response.data.items));

                                                    const postData = {
                                                        id: tempConnection.account_id
                                                    };
                                                    fetch('/api/softwareByID', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify(postData)
                                                    })
                                                        .then(response => response.json())
                                                        .then(async (result) => {
                                                            const postData = {
                                                                id: tempConnection.customer_id
                                                            };
                                                            fetch(`/api/${result[0].name}ByID`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify(postData)
                                                            })
                                                                .then(response => response.json())
                                                                .then(async (result) => {
                                                                    tempAccount = result[0];
                                                                    let jsonData;

                                                                    if (!customerCount) {
                                                                        text += `There are No Customers to Receive\n`;
                                                                        fetchProduct(templateObject, lstUpdateTime, tempConnectionSoftware.base_api_url, tempAccount, token, selConnectionId, text);
                                                                        templateObject.transNote.set(text);
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
                                                                    } else {
                                                                        if (customerCount == 1) {
                                                                            transNOtes = transNOtes +
                                                                                'One customer Successfully Received from Magento\n';
                                                                            templateObject.transNote.set(transNOtes);
                                                                        } else {
                                                                            transNOtes += customerCount + ' Customers Successfully Received from Magento\n\n' +
                                                                                'Converting to TrueERP format...\n';
                                                                            templateObject.transNote.set(transNOtes);
                                                                        }
                                                                    }
                                                                    let responseCount = 0;

                                                                    for (let i = 0; i < customerCount; i++) {
                                                                        jsonData = {
                                                                            "type": "TCustomer",
                                                                            "fields":
                                                                            {
                                                                                "ClientTypeName": "Default",
                                                                                "SourceName": "Radio"
                                                                            }
                                                                        }
                                                                        function sleep(ms) {
                                                                            return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
                                                                        }

                                                                        await sleep(100);
                                                                        var tempNote = transNOtes;
                                                                        jsonData.fields.ClientName = tempResponse[i].firstname + ' ' + tempResponse[i].lastname;
                                                                        transNOtes = tempNote + 'Full-Name formating.... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Title = tempResponse[i].gender == 1 ? "Mrs" : "Mr";
                                                                        transNOtes = tempNote + 'Converting Title .............. \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.FirstName = tempResponse[i].firstname;
                                                                        transNOtes = tempNote + 'Converting FirstName ..... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.LastName = tempResponse[i].lastname;
                                                                        transNOtes = tempNote + 'Converting LastName .................. \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Street = tempResponse[i].addresses[0] ? tempResponse[i].addresses[0].street[0] : '';
                                                                        transNOtes = tempNote + 'Converting Street Address1 ............... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Street2 = tempResponse[i].addresses[0] ? tempResponse[i].addresses[0].street[1] : '';
                                                                        transNOtes = tempNote + 'Converting Street Address2 ...... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Postcode = tempResponse[i].addresses[0] ? tempResponse[i].addresses[0].postcode : '';
                                                                        transNOtes = tempNote + 'Converting Post Code ............................... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.State = tempResponse[i].addresses[0] ? tempResponse[i].addresses[0].region.region_code : '';
                                                                        transNOtes = tempNote + 'Converting State Address ....... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Country = tempResponse[i].addresses[0] ? tempResponse[i].addresses[0].country_id : '';
                                                                        transNOtes = tempNote + 'Converting Country .............................. \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Phone = tempResponse[i].addresses[0] ? tempResponse[i].addresses[0].telephone : '';
                                                                        transNOtes = tempNote + 'Converting Phone Number .................... \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);
                                                                        jsonData.fields.Email = tempResponse[i].email;
                                                                        transNOtes = tempNote + 'Converting Email Address ................................. \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);


                                                                        transNOtes = tempNote + 'Successfully converted to trueERP format. \n';
                                                                        await sleep(500);
                                                                        templateObject.transNote.set(transNOtes);

                                                                        console.log('tempAccount', tempAccount + jsonData);

                                                                        HTTP.call('POST', `${tempAccount.base_url}/TCustomer`, {
                                                                            headers: {
                                                                                'Username': `${tempAccount.user_name}`,
                                                                                'Password': `${tempAccount.password}`,
                                                                                'Database': `${tempAccount.database}`,
                                                                            },
                                                                            data: jsonData
                                                                        }, (error, response) => {
                                                                            responseCount++;
                                                                            if (error) {
                                                                                console.error('Error:', error);
                                                                                transNOtes += `An Error Occurred While Adding a Customer to TrueERP\n`
                                                                                templateObject.transNote.set(transNOtes);
                                                                            }
                                                                            else {
                                                                                transNOtes += `1 Customer Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
                                                                                templateObject.transNote.set(transNOtes);
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
                                                                    }
                                                                })
                                                                .catch((err) => console.log(err))
                                                        })
                                                        .catch((err) => console.log(err))

                                                }
                                            });
                                        }
                                    });
                                })
                                .catch(error => console.log(error));
                        }
                        else if (connectionType == "woocommerce") {
                            let postData = {
                                id: tempConnection.customer_id,
                            };
                            fetch(`/api/WooCommerceByID`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(postData)
                            })
                                .then(response => response.json())
                                .then(async (result) => {
                                    let customerCount;
                                    tempConnectionSoftware = result[0];

                                    let postData = {
                                        id: tempConnection.account_id,
                                    };
                                    fetch(`/api/softwareByID`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(postData)
                                    })
                                        .then(response => response.json())
                                        .then(async (result) => {

                                            let postData = {
                                                id: tempConnection.customer_id,
                                            };
                                            fetch(`/api/${result[0].name}ByID`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(postData)
                                            })
                                                .then(response => response.json())
                                                .then(async (result) => {
                                                    tempAccount = result[0];
                                                    HTTP.call('GET', `${tempConnectionSoftware.base_url}/wc-api/v3/customers?filter[limit] =-1`, {
                                                        headers: {
                                                            'Authorization': 'Basic ' + btoa(`${tempConnectionSoftware.key}:${tempConnectionSoftware.secret}`),
                                                        },
                                                    }, (error, response) => {
                                                        if (error) {
                                                            console.log(error);
                                                            swal(`Error Occurred While Attempting to Connect to the WooCommerce Server`, `Head to Connection Details and Check if WooCommerce Server Configuration is Correct`, "error")
                                                            return;
                                                        } else {
                                                            const filteredCustomers = response.data.customers.filter(customer => {
                                                                const updatedDate = new Date(customer.last_update);
                                                                const last = new Date(lstUpdateTime)
                                                                return updatedDate > last;
                                                            });
                                                            customerCount = filteredCustomers.length;
                                                            tempResponse = filteredCustomers;
                                                            // Process the response data here
                                                            // templateObject.transNote.set(JSON.stringify(response.data.items));
                                                            if (!customerCount) {
                                                                text += `There are No Customers to Receive\n`;
                                                                fetchWooProduct(templateObject, lstUpdateTime, tempAccount, tempConnectionSoftware.base_url, tempConnectionSoftware.key, tempConnectionSoftware.secret, selConnectionId, text);
                                                                templateObject.transNote.set(text);
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
                                                            } else {
                                                                if (customerCount == 1)
                                                                    text += `${customerCount} Customer Successfully Received from WooCommerce\n`;
                                                                else
                                                                    text += `${customerCount} Customers Successfully Received from WooCommerce\n`;
                                                            }

                                                            templateObject.transNote.set(text);

                                                            let postData = {
                                                                id: tempConnection.account_id,
                                                            };
                                                            fetch(`/api/softwareByID`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify(postData)
                                                            })
                                                                .then(response => response.json())
                                                                .then(async (result) => {

                                                                    let postData = {
                                                                        id: tempConnection.customer_id,
                                                                    };
                                                                    fetch(`/api/${result[0].name}ByID`, {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                        body: JSON.stringify(postData)
                                                                    })
                                                                        .then(response => response.json())
                                                                        .then(async (result) => {
                                                                            tempAccount = result[0];
                                                                            let jsonData;
                                                                            let responseCount = 0;

                                                                            for (let i = 0; i < customerCount; i++) {
                                                                                jsonData = {
                                                                                    "type": "TCustomer",
                                                                                    "fields":
                                                                                    {
                                                                                        "ClientTypeName": "Default",
                                                                                        "SourceName": "Radio"
                                                                                    }
                                                                                }
                                                                                jsonData.fields.ClientName = tempResponse[i].first_name + ' ' + tempResponse[i].last_name;
                                                                                jsonData.fields.FirstName = tempResponse[i].first_name;
                                                                                jsonData.fields.LastName = tempResponse[i].last_name;
                                                                                jsonData.fields.Street = tempResponse[i].billing_address.address_1;
                                                                                jsonData.fields.Street2 = tempResponse[i].billing_address.address_2;
                                                                                jsonData.fields.Postcode = tempResponse[i].billing_address.postcode;
                                                                                jsonData.fields.State = tempResponse[i].billing_address.state;
                                                                                jsonData.fields.Country = tempResponse[i].billing_address.country;
                                                                                jsonData.fields.Phone = tempResponse[i].billing_address.phone;
                                                                                jsonData.fields.Email = tempResponse[i].email;

                                                                                HTTP.call('POST', `${tempAccount.base_url}/TCustomer`, {
                                                                                    headers: {
                                                                                        'Username': `${tempAccount.user_name}`,
                                                                                        'Password': `${tempAccount.password}`,
                                                                                        'Database': `${tempAccount.database}`,
                                                                                    },
                                                                                    data: jsonData
                                                                                }, (error, response) => {
                                                                                    responseCount++;
                                                                                    if (error) {
                                                                                        console.error('Error:', error);
                                                                                        text += `An Error Occurred While Adding a Customer to TrueERP\n`
                                                                                        templateObject.transNote.set(text);
                                                                                    }
                                                                                    else {
                                                                                        text += `1 Customer Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
                                                                                        templateObject.transNote.set(text);
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
                                                                                        fetchWooProduct(templateObject, lstUpdateTime, tempAccount, tempConnectionSoftware.base_url, tempConnectionSoftware.key, tempConnectionSoftware.secret, selConnectionId, text);
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                        .catch((err) => console.log(err))
                                                                })
                                                                .catch((err) => console.log(err))
                                                        }
                                                    })
                                                })
                                                .catch((err) => console.log(err))
                                        })
                                        .catch((err) => console.log(err))
                                })
                                .catch((err) => console.log(err))

                        }
                        else if (connectionType == "zoho") {

                            // Meteor.call(`getZohoFromId`, {id: tempConnection.customer_id}, (err, result) => {
                            //     if(err)
                            //         console.error('Error: ', err);
                            //     else {
                            //         tempAccount = result[0];
                            //         Meteor.call(`getAccessToken`, {tempAccount: tempAccount}, (err, result) => {
                            //             if(err)
                            //                 swal(`Error Occurred While Attempting to Connect to the Zoho CRM`,`Head to Connection Details and Check if Zoho CRM Configuration is Correct`, "error")
                            //             else
                            //                 console.log(result);
                            //         })
                            //         // HTTP.call('POST', `${tempAccount.redirect_uri}/oauth/v2/token`, {
                            //         //     data: {
                            //         //         'grant_type': `authorization_code`,
                            //         //         'client_id': `${tempAccount.client_id}`,
                            //         //         'client_secret': `${tempAccount.client_secret}`,
                            //         //         'redirect_uri': `${tempAccount.redirect_uri}`,
                            //         //         'code': `1000.ec67460612687c1be3e1bef9b17b9751.2e0c738cd582f2888162707e8e7d20f0`,
                            //         //     },
                            //         // }, (error, response) => {
                            //         //     if(error)
                            //         //         console.error('Error: ', error);
                            //         //     else
                            //         //         console.log(response);
                            //         // })
                            //     }
                            // })
                        }
                        else {
                            swal(`Error Occurred While Attempting to Connect to the ${result[0].name} Server`, `Head to Connection Details and Check if ${result[0].name} Server Configuration is Correct`, "error")
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        templateObject.transNote.set(error)
                    });
            })
            .catch(error => {
                console.log(error)
                templateObject.transNote.set(error)

            });
        // Meteor.call('getConnectionFromId', {id: selConnectionId}, (err, result) => {
        //     if(err)
        //         console.log(err);
        //     else {
        //         lstUpdateTime = moment(result[0].last_ran_date).format("YYYY-MM-DD HH:mm:ss");
        //         tempConnection = result[0];
        //         Meteor.call('getSoftwareFromId', {id: tempConnection.connection_id}, (err, result) => {
        //             if(err)
        //                 console.log(err);
        //             else {
        //                 connectionType = result[0].name.toLowerCase();
        //                 templateObject.connectionType.set(connectionType);
        //                 if(connectionType == "magento"){
        //                     Meteor.call('getMagentoFromId', {id: tempConnection.customer_id}, (err, result) => {
        //                         if(err)
        //                             console.log(err);
        //                         else {
        //                             tempConnectionSoftware = result[0];
        //                             HTTP.call('POST', `${tempConnectionSoftware.base_api_url}/rest/V1/integration/admin/token`, {
        //                                 headers: {
        //                                     'Content-Type': 'application/json',
        //                                 },
        //                                 data: {
        //                                     'username': `${tempConnectionSoftware.admin_user_name}`,
        //                                     'password': `${tempConnectionSoftware.admin_user_password}`
        //                                 }
        //                             }, (error, response) => {
        //                                 let customer_url = `${tempConnectionSoftware.base_api_url}/rest/all/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=updated_at&searchCriteria[filter_groups][0][filters][0][value]=${lstUpdateTime}&searchCriteria[filter_groups][0][filters][0][condition_type]=gt`;
        //                                 if (error) {
        //                                     console.error('Error:', error);
        //                                     swal(`Error Occurred While Attempting to Connect to the Magneto Server`,`Head to Connection Details and Check if Magento Server Configuration is Correct`, "error")
        //                                     return;
        //                                 } else {
        //                                     token = response.data;
        //                                     let customerCount;
        //                                     HTTP.call('GET', customer_url, {
        //                                         headers: {
        //                                             'Authorization': `Bearer ${token}`,
        //                                             'Content-Type': 'application/json',
        //                                         },
        //                                     }, (error, response) => {
        //                                         if (error) {
        //                                             console.error('Error:', error);
        //                                         } else {
        //                                             customerCount = response.data.total_count;
        //                                             tempResponse = response.data.items;
        //                                             // Process the response data here
        //                                             // templateObject.transNote.set(JSON.stringify(response.data.items));
        //
        //                                             Meteor.call('getSoftwareFromId', {id: tempConnection.account_id}, (err, result) => {
        //                                                 if(err)
        //                                                     console.log(err);
        //                                                 else {
        //                                                     Meteor.call(`get${result[0].name}FromId`, {id: tempConnection.customer_id}, (err, result) => {
        //                                                         if (err)
        //                                                             console.log(err);
        //                                                         else {
        //                                                             tempAccount = result[0];
        //                                                             let jsonData;
        //
        //                                                             if (!customerCount) {
        //                                                                 text += `There are No Customers to Receive\n`;
        //                                                                 fetchProduct(templateObject, lstUpdateTime, tempConnectionSoftware.base_api_url, tempAccount, token, selConnectionId, text);
        //                                                                 templateObject.transNote.set(text);
        //                                                                 let tempDate = new Date();
        //                                                                 let dateString =
        //                                                                     tempDate.getUTCFullYear() + "/" +
        //                                                                     ("0" + (tempDate.getUTCMonth() + 1)).slice(-2) + "/" +
        //                                                                     ("0" + tempDate.getUTCDate()).slice(-2) + " " +
        //                                                                     ("0" + tempDate.getUTCHours()).slice(-2) + ":" +
        //                                                                     ("0" + tempDate.getUTCMinutes()).slice(-2) + ":" +
        //                                                                     ("0" + tempDate.getUTCSeconds()).slice(-2);
        //                                                                 let args = {
        //                                                                     id: selConnectionId,
        //                                                                     last_ran_date: dateString
        //                                                                 };
        //                                                                 Meteor.call('updateLastRanDate', args, (err, result) => {
        //                                                                     if (err)
        //                                                                         console.log(err);
        //                                                                 })
        //                                                             } else {
        //                                                                 if (customerCount == 1)
        //                                                                     text += `${customerCount} Customer Successfully Received from Magento\n`;
        //                                                                 else
        //                                                                     text += `${customerCount} Customers Successfully Received from Magento\n`;
        //                                                             }
        //
        //                                                             templateObject.transNote.set(text);
        //                                                             let responseCount = 0;
        //
        //                                                             for (let i = 0; i < customerCount; i++) {
        //                                                                 jsonData = {
        //                                                                     "type": "TCustomer",
        //                                                                     "fields":
        //                                                                         {
        //                                                                             "ClientTypeName": "Default",
        //                                                                             "SourceName": "Radio"
        //                                                                         }
        //                                                                 }
        //                                                                 jsonData.fields.ClientName = tempResponse[i].firstname + ' ' + tempResponse[i].lastname;
        //                                                                 jsonData.fields.Title = tempResponse[i].gender == 1 ? "Mrs" : "Mr";
        //                                                                 jsonData.fields.FirstName = tempResponse[i].firstname;
        //                                                                 jsonData.fields.LastName = tempResponse[i].lastname;
        //                                                                 jsonData.fields.Street = tempResponse[i].addresses[0].street[0];
        //                                                                 jsonData.fields.Street2 = tempResponse[i].addresses[0].street[1] ? tempResponse[i].addresses[0].street[1] : '';
        //                                                                 jsonData.fields.Postcode = tempResponse[i].addresses[0].postcode;
        //                                                                 jsonData.fields.State = tempResponse[i].addresses[0].region.region_code;
        //                                                                 jsonData.fields.Country = tempResponse[i].addresses[0].country_id;
        //                                                                 jsonData.fields.Phone = tempResponse[i].addresses[0].telephone;
        //                                                                 jsonData.fields.Email = tempResponse[i].email;
        //
        //                                                                 HTTP.call('POST', `${tempAccount.base_url}/TCustomer`, {
        //                                                                     headers: {
        //                                                                         'Username': `${tempAccount.user_name}`,
        //                                                                         'Password': `${tempAccount.password}`,
        //                                                                         'Database': `${tempAccount.database}`,
        //                                                                     },
        //                                                                     data: jsonData
        //                                                                 }, (error, response) => {
        //                                                                     responseCount++;
        //                                                                     if (error) {
        //                                                                         console.error('Error:', error);
        //                                                                         text += `An Error Occurred While Adding a Customer to TrueERP\n`
        //                                                                         templateObject.transNote.set(text);
        //                                                                     }
        //                                                                     else {
        //                                                                         text += `1 Customer Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
        //                                                                         templateObject.transNote.set(text);
        //                                                                     }
        //                                                                     if (responseCount == customerCount) {
        //                                                                         let tempDate = new Date();
        //                                                                         let dateString =
        //                                                                             tempDate.getUTCFullYear() + "/" +
        //                                                                             ("0" + (tempDate.getUTCMonth() + 1)).slice(-2) + "/" +
        //                                                                             ("0" + tempDate.getUTCDate()).slice(-2) + " " +
        //                                                                             ("0" + tempDate.getUTCHours()).slice(-2) + ":" +
        //                                                                             ("0" + tempDate.getUTCMinutes()).slice(-2) + ":" +
        //                                                                             ("0" + tempDate.getUTCSeconds()).slice(-2);
        //                                                                         let args = {
        //                                                                             id: selConnectionId,
        //                                                                             last_ran_date: dateString
        //                                                                         };
        //                                                                         Meteor.call('updateLastRanDate', args, (err, result) => {
        //                                                                             if (err)
        //                                                                                 console.log(err);
        //                                                                         })
        //                                                                         fetchProduct(templateObject, lstUpdateTime, tempConnectionSoftware.base_api_url, tempAccount, token, selConnectionId, text);
        //                                                                     }
        //                                                                 });
        //                                                             }
        //                                                         }
        //                                                     })
        //                                                 }
        //                                             })
        //
        //                                         }
        //                                     });
        //                                 }
        //                             });
        //                         }
        //                     })
        //                 }
        //                 else if (connectionType == "woocommerce") {
        //                     Meteor.call('getWooCommerceFromId', {id: tempConnection.customer_id}, (err, result) => {
        //                         if(err)
        //                             console.log(err);
        //                         else {
        //                             let customerCount;
        //                             tempConnectionSoftware = result[0];
        //
        //                             Meteor.call('getSoftwareFromId', {id: tempConnection.account_id}, (err, result) => {
        //                                 if (err)
        //                                     console.log(err);
        //                                 else {
        //                                     Meteor.call(`get${result[0].name}FromId`, {id: tempConnection.customer_id}, (err, result) => {
        //                                         if (err)
        //                                             console.log(err);
        //                                         else {
        //                                             tempAccount = result[0];
        //                                             HTTP.call('GET', `${tempConnectionSoftware.base_url}/wc-api/v3/customers?filter[limit] =-1`, {
        //                                                 headers: {
        //                                                     'Authorization': 'Basic ' + btoa(`${tempConnectionSoftware.key}:${tempConnectionSoftware.secret}`),
        //                                                 },
        //                                             }, (error, response) => {
        //                                                 if (error) {
        //                                                     console.log(error);
        //                                                     swal(`Error Occurred While Attempting to Connect to the WooCommerce Server`, `Head to Connection Details and Check if WooCommerce Server Configuration is Correct`, "error")
        //                                                     return;
        //                                                 } else {
        //                                                     const filteredCustomers = response.data.customers.filter(customer => {
        //                                                         const updatedDate = new Date(customer.last_update);
        //                                                         const last = new Date(lstUpdateTime)
        //                                                         return updatedDate > last;
        //                                                     });
        //                                                     customerCount = filteredCustomers.length;
        //                                                     tempResponse = filteredCustomers;
        //                                                     // Process the response data here
        //                                                     // templateObject.transNote.set(JSON.stringify(response.data.items));
        //                                                     if (!customerCount) {
        //                                                         text += `There are No Customers to Receive\n`;
        //                                                         fetchWooProduct(templateObject, lstUpdateTime, tempAccount, tempConnectionSoftware.base_url, tempConnectionSoftware.key, tempConnectionSoftware.secret, selConnectionId, text);
        //                                                         templateObject.transNote.set(text);
        //                                                         let tempDate = new Date();
        //                                                         let dateString =
        //                                                             tempDate.getUTCFullYear() + "/" +
        //                                                             ("0" + (tempDate.getUTCMonth() + 1)).slice(-2) + "/" +
        //                                                             ("0" + tempDate.getUTCDate()).slice(-2) + " " +
        //                                                             ("0" + tempDate.getUTCHours()).slice(-2) + ":" +
        //                                                             ("0" + tempDate.getUTCMinutes()).slice(-2) + ":" +
        //                                                             ("0" + tempDate.getUTCSeconds()).slice(-2);
        //                                                         let args = {
        //                                                             id: selConnectionId,
        //                                                             last_ran_date: dateString
        //                                                         };
        //                                                         Meteor.call('updateLastRanDate', args, (err, result) => {
        //                                                             if (err)
        //                                                                 console.log(err);
        //                                                         })
        //                                                     } else {
        //                                                         if (customerCount == 1)
        //                                                             text += `${customerCount} Customer Successfully Received from WooCommerce\n`;
        //                                                         else
        //                                                             text += `${customerCount} Customers Successfully Received from WooCommerce\n`;
        //                                                     }
        //
        //                                                     templateObject.transNote.set(text);
        //
        //                                                     Meteor.call('getSoftwareFromId', {id: tempConnection.account_id}, (err, result) => {
        //                                                         if (err)
        //                                                             console.log(err);
        //                                                         else {
        //                                                             Meteor.call(`get${result[0].name}FromId`, {id: tempConnection.customer_id}, (err, result) => {
        //                                                                 if (err)
        //                                                                     console.log(err);
        //                                                                 else {
        //                                                                     tempAccount = result[0];
        //                                                                     let jsonData;
        //                                                                     let responseCount = 0;
        //
        //                                                                     for (let i = 0; i < customerCount; i++) {
        //                                                                         jsonData = {
        //                                                                             "type": "TCustomer",
        //                                                                             "fields":
        //                                                                                 {
        //                                                                                     "ClientTypeName": "Default",
        //                                                                                     "SourceName": "Radio"
        //                                                                                 }
        //                                                                         }
        //                                                                         jsonData.fields.ClientName = tempResponse[i].first_name + ' ' + tempResponse[i].last_name;
        //                                                                         jsonData.fields.FirstName = tempResponse[i].first_name;
        //                                                                         jsonData.fields.LastName = tempResponse[i].last_name;
        //                                                                         jsonData.fields.Street = tempResponse[i].billing_address.address_1;
        //                                                                         jsonData.fields.Street2 = tempResponse[i].billing_address.address_2;
        //                                                                         jsonData.fields.Postcode = tempResponse[i].billing_address.postcode;
        //                                                                         jsonData.fields.State = tempResponse[i].billing_address.state;
        //                                                                         jsonData.fields.Country = tempResponse[i].billing_address.country;
        //                                                                         jsonData.fields.Phone = tempResponse[i].billing_address.phone;
        //                                                                         jsonData.fields.Email = tempResponse[i].email;
        //
        //                                                                         HTTP.call('POST', `${tempAccount.base_url}/TCustomer`, {
        //                                                                             headers: {
        //                                                                                 'Username': `${tempAccount.user_name}`,
        //                                                                                 'Password': `${tempAccount.password}`,
        //                                                                                 'Database': `${tempAccount.database}`,
        //                                                                             },
        //                                                                             data: jsonData
        //                                                                         }, (error, response) => {
        //                                                                             responseCount ++;
        //                                                                             if (error) {
        //                                                                                 console.error('Error:', error);
        //                                                                                 text += `An Error Occurred While Adding a Customer to TrueERP\n`
        //                                                                                 templateObject.transNote.set(text);
        //                                                                             }
        //                                                                             else {
        //                                                                                 text += `1 Customer Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
        //                                                                                 templateObject.transNote.set(text);
        //                                                                             }
        //                                                                             if(responseCount == customerCount) {
        //                                                                                 let tempDate = new Date();
        //                                                                                 let dateString =
        //                                                                                     tempDate.getUTCFullYear() + "/" +
        //                                                                                     ("0" + (tempDate.getUTCMonth() + 1)).slice(-2) + "/" +
        //                                                                                     ("0" + tempDate.getUTCDate()).slice(-2) + " " +
        //                                                                                     ("0" + tempDate.getUTCHours()).slice(-2) + ":" +
        //                                                                                     ("0" + tempDate.getUTCMinutes()).slice(-2) + ":" +
        //                                                                                     ("0" + tempDate.getUTCSeconds()).slice(-2);
        //                                                                                 let args = {
        //                                                                                     id: selConnectionId,
        //                                                                                     last_ran_date: dateString
        //                                                                                 };
        //                                                                                 Meteor.call('updateLastRanDate', args, (err, result) => {
        //                                                                                     if (err)
        //                                                                                         console.log(err);
        //                                                                                 })
        //                                                                                 fetchWooProduct(templateObject, lstUpdateTime, tempAccount, tempConnectionSoftware.base_url, tempConnectionSoftware.key, tempConnectionSoftware.secret, selConnectionId, text);
        //                                                                             }
        //                                                                         });
        //                                                                     }
        //                                                                 }
        //                                                             })
        //                                                         }
        //                                                     })
        //                                                 }
        //                                             })
        //                                         }
        //                                     })
        //                                 }
        //                             })
        //                         }
        //                     })
        //
        //                 }
        //                 else if (connectionType == "zoho") {
        //
        //                     Meteor.call(`getZohoFromId`, {id: tempConnection.customer_id}, (err, result) => {
        //                         if(err)
        //                             console.error('Error: ', err);
        //                         else {
        //                             tempAccount = result[0];
        //                             Meteor.call(`getAccessToken`, {tempAccount: tempAccount}, (err, result) => {
        //                                 if(err)
        //                                     swal(`Error Occurred While Attempting to Connect to the Zoho CRM`,`Head to Connection Details and Check if Zoho CRM Configuration is Correct`, "error")
        //                                 else
        //                                     console.log(result);
        //                             })
        //                             // HTTP.call('POST', `${tempAccount.redirect_uri}/oauth/v2/token`, {
        //                             //     data: {
        //                             //         'grant_type': `authorization_code`,
        //                             //         'client_id': `${tempAccount.client_id}`,
        //                             //         'client_secret': `${tempAccount.client_secret}`,
        //                             //         'redirect_uri': `${tempAccount.redirect_uri}`,
        //                             //         'code': `1000.ec67460612687c1be3e1bef9b17b9751.2e0c738cd582f2888162707e8e7d20f0`,
        //                             //     },
        //                             // }, (error, response) => {
        //                             //     if(error)
        //                             //         console.error('Error: ', error);
        //                             //     else
        //                             //         console.log(response);
        //                             // })
        //                         }
        //                     })
        //                 }
        //                 else {
        //                     swal(`Error Occurred While Attempting to Connect to the ${result[0].name} Server`,`Head to Connection Details and Check if ${result[0].name} Server Configuration is Correct`, "error")
        //                 }
        //             }
        //         })
        //     }
        // })
    },

    'click #tblConnectionList tbody td:nth-child(n)': function (event) {
        let listData = $(event.target).closest('tr').attr("id");
        Template.instance().selConnectionId.set(listData);
        $(event.target).closest('tr').siblings().removeClass('currentSelect');
        $(event.target).closest('tr').addClass('currentSelect');
    },

    'click #tblConnectionListInTab tbody td:nth-child(n)': function (event) {
        var listData = $(event.target).closest('tr').attr("id");
        var customerId = FlowRouter.current().queryParams.id;
        var target = $(event.target)[0].innerText;
        if ($(event.target)[0].className == '  colConnectionSoftware') {
            FlowRouter.go('/connectionscard?id=' + listData + '&customerId=' + customerId + '&tab=2');
        }
        else if ($(event.target)[0].className == '  colAccountingSoftware') {
            FlowRouter.go('/connectionscard?id=' + listData + '&customerId=' + customerId + '&tab=1');
        }
        Template.instance().selConnectionId.set(listData);
        $(event.target).closest('tr').siblings().removeClass('currentSelect');
        $(event.target).closest('tr').addClass('currentSelect');
    },

    'click #transActions': function (event) {
        jQuery('#transactionModal').modal('toggle');
    }
});

Template.customerscard.onRendered(h => {
    setTimeout(function () {
        $("#startDate").datepicker({
            showOn: 'button',
            buttonText: 'Show Date',
            buttonImageOnly: true,
            buttonImage: '/img/imgCal2.png',
            dateFormat: 'dd/mm/yy',
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
        })
    }, 500);
    // $("#startDate").datepicker({ dateFormat: 'dd/mm/yy', }).datepicker("setDate", new Date());

    if (FlowRouter.current().queryParams.id) {
        if (FlowRouter.current().queryParams.TransTab == 'connection') {
            $('.customerTab').removeClass('active');
            $('.connectionTab').trigger('click');
        } else {
            $('.connectionTab').removeClass('active');
            $('.customerTab').trigger('click');
        }

        // Meteor.call('getCustomerFromId', FlowRouter.current().queryParams, (err, result) => {
        //     if (err) swal("","Oooooops something went wrong!", "error")
        //     else {
        //         $('#edtCustomerCompany').val(result[0].name)
        //         $("#edtCustomerEmail").val(result[0].email)
        //         $("#edtFirstName").val(result[0].firstName)
        //         $("#edtMiddleName").val(result[0].middleName)
        //         $("#edtLastName").val(result[0].lastName)
        //         $('#edtCustomerPhone').val(result[0].phone)
        //         $('#edtCustomerMobile').val(result[0].Mobile)
        //         $('#edtCustomerFax').val(result[0].fax)
        //         $("#edtCustomerSkypeID").val(result[0].skypeID)
        //         $("#edtCustomerWebsite").val(result[0].website)
        //
        //         $('#updateCustomer').show()
        //         $('#saveCustomer').hide()
        //     }
        // })

        const postData = {
            id: FlowRouter.current().queryParams.id
        }

        fetch('/api/customersByID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(async (result) => {
                console.debug('customer by ID', result);
                $('#edtCustomerCompany').val(result[0].name)
                $("#edtCustomerEmail").val(result[0].email)
                $("#edtFirstName").val(result[0].firstName)
                $("#edtMiddleName").val(result[0].middleName)
                $("#edtLastName").val(result[0].lastName)
                $('#edtCustomerPhone').val(result[0].phone)
                $('#edtCustomerMobile').val(result[0].Mobile)
                $('#edtCustomerFax').val(result[0].fax)
                $("#edtCustomerSkypeID").val(result[0].skypeID)
                $("#edtCustomerWebsite").val(result[0].website)
                $('#logonPasswrod').val(result[0].logon_password)
                $('#logonName').val(result[0].logon_name)

                $('#updateCustomer').show()
                $('#saveCustomer').hide()
            })
            .catch(error => swal("", "Oooooops something went wrong!", "error"));
    }
    // $("#edtWeeklyStartDate,#edtWeeklyFinishDate,#dtDueDate,#customdateone,#edtMonthlyStartDate,#edtMonthlyFinishDate,#edtDailyStartDate,#edtDailyFinishDate,#edtOneTimeOnlyDate").datepicker({
    //     showOn: 'button',
    //     buttonText: 'Show Date',
    //     buttonImageOnly: true,
    //     buttonImage: '/img/imgCal2.png',
    //     constrainInput: false,
    //     dateFormat: 'd/mm/yy',
    //     showOtherMonths: true,
    //     selectOtherMonths: true,
    //     changeMonth: true,
    //     changeYear: true,
    //     yearRange: "-90:+10",
    // });

    // $('#tblConnectionList tbody').on('click', 'td:nth-child(n)', function () {
    //     let listData = $(this).closest('tr').attr("id");
    //     Template.instance().selConnectionId.set(listData);
    //     $(this).closest('tr').siblings().removeClass('currentSelect');
    //     $(this).closest('tr').addClass('currentSelect');
    // });
}),

Template.customerscard.helpers({
    listNumber: () => {
        return localStorage.getItem('customerActiveNumber');
    },
    // record: () => {
    //     let parentRecord = Template.parentData(0).record;
    //     if (parentRecord) {
    //         return parentRecord;
    //     } else {
    //         let temp = Template.instance().records.get();
    //         let phoneCodes = Template.instance().phoneCodeData.get();
    //         if (temp && temp.mobile && temp.country) {
    //             let thisCountry = phoneCodes.find(item => {
    //                 return item.name == temp.country
    //             })
    //             temp.mobile = temp.mobile.replace(thisCountry.dial_code, '0')
    //         }
    //         return temp;
    //     }
    // },

    currentTab: () => {
        let currentId = FlowRouter.current().queryParams;
        if (currentId.TransTab == 'connection')
            return "tab-3";
        return "tab-1";
    },

    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function (data) {
            let dataReturn = templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    todayDate: function () {
        return Template.instance().todayDate.get();
    },

    transNote: function () {
        return Template.instance().transNote.get();
    },

    selConnectionId: function () {
        return Template.instance().selConnectionId.get();
    }

});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});

const fetchProduct = (templateObject, lstUpdateTime, base_api_url, tempAccount, token, selConnectionId, text) => {
    // let productCount, tempResponse;
    // let product_url = `${base_api_url}/rest/all/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=updated_at&searchCriteria[filter_groups][0][filters][0][value]=${lstUpdateTime}&searchCriteria[filter_groups][0][filters][0][condition_type]=gt`;
    // HTTP.call('GET', product_url, {
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //     },
    // }, (error, response) => {
    //     if (error) {
    //         console.error('Error:', error);
    //     } else {
    //         productCount = response.data.total_count;
    //         tempResponse = response.data.items;
    //         // Process the response data here
    //         // templateObject.transNote.set(JSON.stringify(response.data.items));
    //         if(!productCount){
    //             text += `There are No Products to Receive\n`;
    //             templateObject.transNote.set(text);
    //             fetchOrder(templateObject, lstUpdateTime, base_api_url, tempAccount, token, selConnectionId, text);
    //         } else {
    //             if(productCount == 1)
    //                 text += `${productCount} Product Successfully Received from Magento\n`;
    //             else
    //                 text += `${productCount} Products Successfully Received from Magento\n`;
    //         }
    //
    //         templateObject.transNote.set(text);
    //
    //         let jsonData;
    //
    //         for(let i = 0 ; i < productCount ; i ++) {
    //             jsonData = {
    //                 "type":"TProductWeb",
    //                 "fields":
    //                     {
    //                         "ProductType":"INV",
    //                         "ProductName": tempResponse[i].name,
    //                         "PurchaseDescription":tempResponse[i].name,
    //                         "SalesDescription":tempResponse[i].name,
    //                         "AssetAccount":"Inventory Asset",
    //                         "CogsAccount":"Cost of Goods Sold",
    //                         "IncomeAccount":"Sales",
    //                         "BuyQty1":tempResponse[i].UOMQtySold,
    //                         "BuyQty1Cost": tempResponse[i].price,
    //                         "BuyQty2":tempResponse[i].UOMQtySold,
    //                         "BuyQty2Cost": tempResponse[i].price,
    //                         "BuyQty3":tempResponse[i].UOMQtySold,
    //                         "BuyQty3Cost": tempResponse[i].price,
    //                         "SellQty1":tempResponse[i].UOMQtySold,
    //                         "SellQty1Price": tempResponse[i].price,
    //                         "SellQty2":tempResponse[i].UOMQtySold,
    //                         "SellQty2Price": tempResponse[i].price,
    //                         "SellQty3":tempResponse[i].UOMQtySold,
    //                         "SellQty3Price": tempResponse[i].price,
    //                         "TaxCodePurchase":"NCG",
    //                         "TaxCodeSales":"GST",
    //                         "UOMPurchases":"Units",
    //                         "UOMSales":"Units"
    //                     }
    //             }
    //
    //             HTTP.call('POST', `${tempAccount.base_url}/TProductWeb`, {
    //                 headers: {
    //                     'Username': `${tempAccount.user_name}`,
    //                     'Password': `${tempAccount.password}`,
    //                     'Database': `${tempAccount.database}`,
    //                 },
    //                 data: jsonData
    //             }, (error, response) => {
    //                 if( i == productCount - 1)
    //                     fetchOrder(templateObject, lstUpdateTime, base_api_url, tempAccount, token, selConnectionId, text);
    //                 if (error)
    //                     console.error('Error:', error);
    //                 else {
    //                     text += `1 Product Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
    //                     templateObject.transNote.set(text);
    //                 }
    //             });
    //         }
    //     }
    // });
    let productCount, tempResponse;
    let product_url = `${tempAccount.base_url}/TProduct?select=[MsTimeStamp]>"` + `${lstUpdateTime}"&ListType=Detail`;
    HTTP.call('GET', product_url, {
        headers: {
            'Username': `${tempAccount.user_name}`,
            'Password': `${tempAccount.password}`,
            'Database': `${tempAccount.database}`,
        },
    }, (error, response) => {
        if (error)
            console.log(error);
        else {
            productCount = response.data.tproduct.length;
            tempResponse = response.data.tproduct;

            // Process the response data here
            // templateObject.transNote.set(JSON.stringify(response.data.items));
            if (!productCount) {
                text += `There are No Products to Receive\n`;
                templateObject.transNote.set(text);
                fetchOrder(templateObject, lstUpdateTime, base_api_url, tempAccount, token, selConnectionId, text);
            } else {
                if (productCount == 1)
                    text += `${productCount} Product Successfully Received from TrueERP\n`;
                else
                    text += `${productCount} Products Successfully Received from TrueERP\n`;
            }

            templateObject.transNote.set(text);

            let jsonData;
            let responseCount = 0;

            for (let i = 0; i < productCount; i++) {
                jsonData = {
                    "product": {
                        "sku": tempResponse[i].fields.GlobalRef,
                        "name": tempResponse[i].fields.ProductName,
                        "attribute_set_id": 4,
                        "price": tempResponse[i].fields.SellQty1PriceInc,
                        "status": tempResponse[i].fields.Active ? 1 : 0,
                        "visibility": 4,
                        "type_id": "simple",
                        "weight": `${tempResponse[i].fields.NetWeightKg}`,
                        "extension_attributes": {
                            "stock_item": {
                                "qty": `${tempResponse[i].fields.TotalStockQty}`,
                                "is_in_stock": tempResponse[i].fields.TotalStockQty ? true : false
                            }
                        },
                        "custom_attributes": [
                            {
                                "attribute_code": "PrintName",
                                "value": tempResponse[i].fields.ProductPrintName ? tempResponse[i].fields.ProductPrintName : ""
                            },
                            {
                                "attribute_code": "PurchaseDescription",
                                "value": tempResponse[i].fields.PurchaseDescription ? tempResponse[i].fields.PurchaseDescription : ""
                            },
                            {
                                "attribute_code": "Description",
                                "value": tempResponse[i].fields.SalesDescription ? tempResponse[i].fields.SalesDescription : ""
                            },
                            {
                                "attribute_code": "SellQty1Price",
                                "value": tempResponse[i].fields.SellQty1Price ? tempResponse[i].fields.SellQty1Price : 0
                            },
                            {
                                "attribute_code": "BuyQty1Cost",
                                "value": tempResponse[i].fields.BuyQty1Cost ? tempResponse[i].fields.BuyQty1Cost : 0
                            },
                            {
                                "attribute_code": "SubGroup",
                                "value": tempResponse[i].fields.ProductGroup1 ? tempResponse[i].fields.ProductGroup1 : ""
                            },
                            {
                                "attribute_code": "Type",
                                "value": tempResponse[i].fields.ProductGroup2 ? tempResponse[i].fields.ProductGroup2 : ""
                            },
                            {
                                "attribute_code": "Dept",
                                "value": tempResponse[i].fields.ProductGroup3 ? tempResponse[i].fields.ProductGroup3 : ""
                            },
                        ]
                    }
                }

                HTTP.call('POST', `${base_api_url}/rest/default/V1/products`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    data: jsonData
                }, (error, response) => {
                    responseCount++;
                    if (error) {
                        console.error('Error:', error);
                        text += `An Error Occurred While Adding a Product to Magento\n`
                        templateObject.transNote.set(text);
                    }
                    else {
                        text += `1 Product Successfully Added to Magento with ID Number ${response.data.id}\n`
                        templateObject.transNote.set(text);
                    }
                    if (responseCount == productCount) {
                        fetchOrder(templateObject, lstUpdateTime, base_api_url, tempAccount, token, selConnectionId, text);
                    }
                });
            }
        }
    });

}

const fetchOrder = (templateObject, lstUpdateTime, base_api_url, tempAccount, token, selConnectionId, text) => {
    let itemCount = 0, tempResponse, tempConnection;
    let order_url = `${base_api_url}/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=updated_at&searchCriteria[filter_groups][0][filters][0][value]=${lstUpdateTime}&searchCriteria[filter_groups][0][filters][0][condition_type]=gt`;
    HTTP.call('GET', order_url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }, (error, response) => {
        if (error) {
            console.error('Error:', error);
        } else {
            itemCount = response.data.total_count;
            tempResponse = response.data.items;
            // Process the response data here
            // templateObject.transNote.set(JSON.stringify(response.data.items));
            if (!itemCount) {
                text += `There are No Sales Orders to Receive\n`;
                templateObject.transNote.set(text);
            } else {
                if (itemCount == 1)
                    text += `${itemCount} Sales Order Successfully Received from Magento\n`;
                else
                    text += `${itemCount} Sales Orders Successfully Received from Magento\n`;
            }

            templateObject.transNote.set(text);

            let jsonData;

            for (let i = 0; i < itemCount; i++) {
                jsonData = {
                    "type": "TSalesOrder",
                    "fields":
                    {
                        "GLAccountName": "Accounts Receivable",
                        "CustomerName": tempResponse[i].customer_firstname + ' ' + tempResponse[i].customer_lastname,
                        "TermsName": "COD",
                        "SaleClassName": "Default",
                        "SaleDate": tempResponse[i].created_at,
                        "Comments": `${tempResponse[i].status_histories.length ? tempResponse[i].status_histories[0].comment : ""}`,
                        "TotalAmount": tempResponse[i].base_subtotal,
                        "TotalAmountInc": tempResponse[i].base_total_due
                    }
                }
                jsonData.fields.ShipToDesc = `${tempResponse[i].extension_attributes.shipping_assignments[0].shipping.address.street[0]}\r\n${tempResponse[i].extension_attributes.shipping_assignments[0].shipping.address.city}\r\n${tempResponse[i].extension_attributes.shipping_assignments[0].shipping.address.country_id}`;
                let lineItems = [];
                for (let j = 0; j < tempResponse[i].items.length; j++) {
                    let tempItems = {
                        "type": "TSalesOrderLine",
                        "fields":
                        {
                            "ProductName": tempResponse[i].items[j].name,
                            "UnitOfMeasure": "Units",
                            "UOMQtySold": tempResponse[i].items[j].qty_ordered ? tempResponse[i].items[j].qty_ordered : 0,
                            "LinePrice": tempResponse[i].items[j].base_row_total ? tempResponse[i].items[j].base_row_total : 0,
                            "LinePriceInc": tempResponse[i].items[j].original_price ? tempResponse[i].items[j].original_price : 0,
                            "TotalLineAmount": tempResponse[i].items[j].price ? tempResponse[i].items[j].price : 0,
                            "TotalLineAmountInc": tempResponse[i].items[j].price_incl_tax ? tempResponse[i].items[j].price_incl_tax : 0
                        }
                    }
                    lineItems.push(tempItems);
                }
                jsonData.fields.Lines = lineItems;

                HTTP.call('POST', `${tempAccount.base_url}/TSalesOrder`, {
                    headers: {
                        'Username': `${tempAccount.user_name}`,
                        'Password': `${tempAccount.password}`,
                        'Database': `${tempAccount.database}`,
                    },
                    data: jsonData
                }, (error, response) => {
                    if (error)
                        console.error('Error:', error);
                    else {
                        text += `1 Sales Order Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
                        templateObject.transNote.set(text);
                    }
                });
            }
        }
    });
}

const fetchWooProduct = (templateObject, lstUpdateTime, tempAccount, base_url, key, secret, selConnectionId, text) => {
    // let productCount, tempResponse;
    // let product_url = `${base_url}/wc-api/v3/products?filter[limit] =-1`;
    // HTTP.call('GET', product_url, {
    //     headers: {
    //         'Authorization': 'Basic ' + btoa(`${key}:${secret}`),
    //     },
    // }, (error, response) => {
    //     if (error) {
    //         console.error('Error:', error);
    //     } else {
    //         const filteredProducts = response.data.products.filter(product => {
    //             const updatedDate = new Date(product.updated_at);
    //             const last = new Date(lstUpdateTime)
    //             return updatedDate > last;
    //         });
    //         productCount = filteredProducts.length;
    //         tempResponse = filteredProducts;
    //         // Process the response data here
    //         // templateObject.transNote.set(JSON.stringify(response.data.items));
    //         if(!productCount){
    //             text += `There are No Products to Receive\n`;
    //             templateObject.transNote.set(text);
    //             fetchWooOrder(templateObject, lstUpdateTime, tempAccount, base_url, key, secret, selConnectionId, text);
    //         } else {
    //             if(productCount == 1)
    //                 text += `${productCount} Product Successfully Received from WooCommerce\n`;
    //             else
    //                 text += `${productCount} Products Successfully Received from WooCommerce\n`;
    //         }
    //
    //         templateObject.transNote.set(text);
    //
    //         let jsonData;
    //
    //         for(let i = 0 ; i < productCount ; i ++) {
    //             jsonData = {
    //                 "type":"TProductWeb",
    //                 "fields":
    //                     {
    //                         "ProductType":"INV",
    //                         "ProductName": tempResponse[i].title,
    //                         "PurchaseDescription":tempResponse[i].description,
    //                         "SalesDescription":tempResponse[i].short_description,
    //                         "AssetAccount":"Inventory Asset",
    //                         "CogsAccount":"Cost of Goods Sold",
    //                         "IncomeAccount":"Sales",
    //                         "BuyQty1":1,
    //                         "BuyQty1Cost": parseFloat(tempResponse[i].price),
    //                         "BuyQty2":1,
    //                         "BuyQty2Cost": parseFloat(tempResponse[i].price),
    //                         "BuyQty3":1,
    //                         "BuyQty3Cost": parseFloat(tempResponse[i].price),
    //                         "SellQty1":1,
    //                         "SellQty1Price": parseFloat(tempResponse[i].price),
    //                         "SellQty2":1,
    //                         "SellQty2Price": parseFloat(tempResponse[i].price),
    //                         "SellQty3":1,
    //                         "SellQty3Price": parseFloat(tempResponse[i].price),
    //                         "TaxCodePurchase":"NCG",
    //                         "TaxCodeSales":"GST",
    //                         "UOMPurchases":"Units",
    //                         "UOMSales":"Units"
    //                     }
    //             }
    //
    //             HTTP.call('POST', `${tempAccount.base_url}/TProductWeb`, {
    //                 headers: {
    //                     'Username': `${tempAccount.user_name}`,
    //                     'Password': `${tempAccount.password}`,
    //                     'Database': `${tempAccount.database}`,
    //                 },
    //                 data: jsonData
    //             }, (error, response) => {
    //                 if( i == productCount - 1)
    //                     fetchWooOrder(templateObject, lstUpdateTime, tempAccount, base_url, key, secret, selConnectionId, text);
    //                 if (error)
    //                     console.error('Error:', error);
    //                 else {
    //                     text += `1 Product Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
    //                     templateObject.transNote.set(text);
    //                 }
    //             });
    //         }
    //     }
    // });
    let productCount, tempResponse;
    let product_url = `${tempAccount.base_url}/TProduct?select=[MsTimeStamp]>"` + `${lstUpdateTime}"&ListType=Detail`;
    HTTP.call('GET', product_url, {
        headers: {
            'Username': `${tempAccount.user_name}`,
            'Password': `${tempAccount.password}`,
            'Database': `${tempAccount.database}`,
        },
    }, (error, response) => {
        if (error)
            console.log(error);
        else {
            productCount = response.data.tproduct.length;
            tempResponse = response.data.tproduct;

            // Process the response data here
            // templateObject.transNote.set(JSON.stringify(response.data.items));
            if (!productCount) {
                text += `There are No Products to Receive\n`;
                templateObject.transNote.set(text);
                fetchWooOrder(templateObject, lstUpdateTime, tempAccount, base_url, key, secret, selConnectionId, text);
            } else {
                if (productCount == 1)
                    text += `${productCount} Product Successfully Received from TrueERP\n`;
                else
                    text += `${productCount} Products Successfully Received from TrueERP\n`;
            }

            templateObject.transNote.set(text);

            let jsonData;
            let responseCount = 0;

            for (let i = 0; i < productCount; i++) {
                jsonData = {
                    name: tempResponse[i].fields.ProductName,
                    type: "simple",
                    regular_price: `${tempResponse[i].fields.SellQty1Price}`,
                    description: tempResponse[i].fields.ProductPrintName,
                    short_description: tempResponse[i].fields.SalesDescription,
                }

                HTTP.call('POST', `${base_url}/wp-json/wc/v3/products`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${key}:${secret}`),
                    },
                    data: jsonData
                }, (error, response) => {
                    responseCount++;
                    if (error) {
                        console.error('Error:', error);
                        text += `An Error Occurred While Adding a Product to WooCommerce\n`
                        templateObject.transNote.set(text);
                    }
                    else {
                        text += `1 Product Successfully Added to WooCommerce with ID Number ${response.data.id}\n`
                        templateObject.transNote.set(text);
                    }
                    if (responseCount == productCount) {
                        fetchWooOrder(templateObject, lstUpdateTime, tempAccount, base_url, key, secret, selConnectionId, text);
                    }
                });
            }
        }
    });
}

const fetchWooOrder = (templateObject, lstUpdateTime, tempAccount, base_url, key, secret, selConnectionId, text) => {
    let itemCount = 0, tempResponse, tempConnection;
    let order_url = `${base_url}/wc-api/v3/orders?filter[limit] =-1`;
    HTTP.call('GET', order_url, {
        headers: {
            'Authorization': 'Basic ' + btoa(`${key}:${secret}`),
        },
    }, (error, response) => {
        if (error) {
            console.error('Error:', error);
        } else {
            const filteredOrders = response.data.orders.filter(order => {
                const updatedDate = new Date(order.updated_at);
                const last = new Date(`${lstUpdateTime}Z`)
                return updatedDate > last;
            });
            itemCount = filteredOrders.length;
            tempResponse = filteredOrders;
            // Process the response data here
            // templateObject.transNote.set(JSON.stringify(response.data.items));
            if (!itemCount) {
                text += `There are No Sales Orders to Receive\n`;
                templateObject.transNote.set(text);
            } else {
                if (itemCount == 1)
                    text += `${itemCount} Sales Order Successfully Received from WooCommerce\n`;
                else
                    text += `${itemCount} Sales Orders Successfully Received from WooCommerce\n`;
            }

            templateObject.transNote.set(text);

            let jsonData;

            for (let i = 0; i < itemCount; i++) {
                jsonData = {
                    "type": "TSalesOrder",
                    "fields":
                    {
                        "GLAccountName": "Accounts Receivable",
                        "CustomerName": tempResponse[i].billing_address.first_name + ' ' + tempResponse[i].billing_address.last_name,
                        "TermsName": "COD",
                        "SaleClassName": "Default",
                        "SaleDate": tempResponse[i].created_at,
                        "Comments": tempResponse[i].note,
                        "TotalAmount": parseFloat(tempResponse[i].total),
                        "TotalAmountInc": parseFloat(tempResponse[i].subtotal)
                    }
                }
                let lineItems = [];
                for (let j = 0; j < tempResponse[i].line_items.length; j++) {
                    let tempItems = {
                        "type": "TSalesOrderLine",
                        "fields":
                        {
                            "ProductName": tempResponse[i].line_items[j].name.split(' - ')[0],
                            "UnitOfMeasure": "Units",
                            "UOMQtySold": parseFloat(tempResponse[i].line_items[j].quantity),
                            "LinePrice": parseFloat(tempResponse[i].line_items[j].subtotal),
                            "LinePriceInc": parseFloat(tempResponse[i].line_items[j].total),
                            "TotalLineAmount": parseFloat(tempResponse[i].line_items[j].subtotal),
                            "TotalLineAmountInc": parseFloat(tempResponse[i].line_items[j].total)
                        }
                    }
                    lineItems.push(tempItems);
                }
                jsonData.fields.Lines = lineItems;

                HTTP.call('POST', `${tempAccount.base_url}/TSalesOrder`, {
                    headers: {
                        'Username': `${tempAccount.user_name}`,
                        'Password': `${tempAccount.password}`,
                        'Database': `${tempAccount.database}`,
                    },
                    data: jsonData
                }, (error, response) => {
                    if (error)
                        console.error('Error:', error);
                    else {
                        text += `1 Sales Order Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
                        templateObject.transNote.set(text);
                    }
                });
            }
        }
    });
}

export const pullRecords = (employeeId,
    onSuccess = async () => {
        const result = await swal({
            title: "Update completed",
            //text: "Do you wish to add an account ?",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok",
        });

        if (result.value) {

        }
    },
    onError = async () => {
        const result = await swal({
            title: "Oooops...",
            text: "Couldn't update currencies",
            type: "error",
            showCancelButton: true,
            confirmButtonText: "Try Again"
        });

        if (result.value) {
            $('.synbutton').trigger('click');
        } else if (result.dismiss === "cancel") { }
    }) => {
    // let completeCount = 0;
    // let completeCountEnd = 1;

    // LoadingOverlay.show();
    const loadingUpdate = swal({
        title: "Update in progress",
        text: "Downloading currencies",
        // text: "Do you wish to add an account ?",
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
            swal.showLoading();
        }
    });

    // we need to get all currencies and update them all
    const taxRateService = new TaxRateService();
    // taxRateService.getCurrencies().then(data => {
    //   completeCountEnd = data.tcurrency.length;
    //   if (data.tcurrency.length > 0)
    //     data = data.tcurrency;

    //   data.forEach(currencyData => {
    //     updateCurrency(currencyData, () => {
    //       if (completeCount == 0) {
    //         LoadingOverlay.show();
    //       } else if (completeCount == completeCountEnd) {
    //         LoadingOverlay.hide();
    //       }
    //       completeCount++;
    //     });
    //   });
    // });

    // Get all currencies from remote database
    taxRateService.getCurrencies().then(result => {
        /**
         * Db currencies
         */
        let currencies = result.tcurrencylist;

        //swal.getContent().textContent = "Syncing to XE.com";
        swal.getContent().textContent = "Syncing to financialmodelingprep.com";

        // get all rates from xe currency
        FxApi.getAllRates({
            from: defaultCurrencyCode,
            callback: async response => {

                if (response === false) {
                    swal.close();
                    return;
                }
                /**
                 * List of Xe currencies
                 */
                // const xeCurrencies = response.to;
                // // if (result.value) {
                // // } else if (result.dismiss === "cancel") {
                // // }
                //
                // currencies.forEach((currency, index) => {
                //  currencies[index].BuyRate = FxApi.findBuyRate(currency.Code, xeCurrencies);
                //  currencies[index].SellRate = FxApi.findSellRate(currency.Code, xeCurrencies);
                // });
                //
                let formatedList = [];
                //
                // currencies.forEach((currency) => {
                //   formatedList.push({
                //     type: "TCurrency",
                //     fields: currency
                //   });
                // });

                let currencyRate = {};
                response.forEach((cur, index) => {
                    if (cur.ticker.includes(defaultCurrencyCode)) {
                        let src = cur.ticker.substring(0, 3);
                        let dst = cur.ticker.slice(-3);
                        if (src == defaultCurrencyCode) {
                            currencyRate[dst] = {
                                currencyCode: dst,
                                buyRate: cur.bid,
                                sellRate: (1 / cur.bid).toFixed(5),
                                RateLastModified: cur.date,
                            };
                        }
                        else {
                            currencyRate[src] = {
                                currencyCode: src,
                                buyRate: (1 / cur.bid).toFixed(5),
                                sellRate: cur.bid,
                                RateLastModified: cur.date,
                            };
                        }
                    }
                });

                currencies.forEach((currency, index) => {
                    if (currencyRate[currency.Code] != undefined) {
                        formatedList.push({
                            type: "TCurrency",
                            fields: {
                                ID: currency.CurrencyID,
                                BuyRate: Number(currencyRate[currency.Code].buyRate),
                                SellRate: Number(currencyRate[currency.Code].sellRate),
                                RateLastModified: currencyRate[currency.Code].RateLastModified,
                            }
                        });
                    }
                });

                swal.getContent().textContent = "Save currencies";

                // Now we need to save this
                await FxApi.saveCurrencies(formatedList, async (response, error) => {
                    swal.close();
                    if (response) {
                        LoadingOverlay.hide();
                        await onSuccess();
                        $('.btnRefresh').trigger('click');
                    } else if (error) {
                        LoadingOverlay.hide();
                        await onError();


                    }
                });
            }
        });
    });
};