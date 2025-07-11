import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import pool from '../../imports/api/dbConection.js';


Meteor.methods({
    'getZoho': function () {
        const s = 'SELECT * FROM clientZoho'
        return new Promise((resolve, reject) => {
            pool.query(s, (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        });
    },

    'getZohoFromId': function ( data ) {
        const s = 'SELECT * FROM clientZoho WHERE id=' + data.id
        return new Promise((resolve, reject) => {
            pool.query(s, (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        });
    },

    'getZohoFromCustomerId': function ( data ) {
        const s = 'SELECT * FROM clientZoho WHERE customer_id=' + data.id
        return new Promise((resolve, reject) => {
            pool.query(s, (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        });
    },

    'addZoho': function ({ dbName, accName, connName, lastRanDate, runCycle, nextRunDate, enabled }) {
        console.log('add Zoho')
        return new Promise((resolve, reject) => {
            const addQuery = "INSERT INTO `coreedit`.`clientZoho` (`db_name`, `acc_name`, `conn_name`, `last_ran_date`, `last_ran_date`, `next_run_date`, `enabled`) VALUES ('" + dbName + "' , '" + accName + "', '" + connName + "', '" + lastRanDate + "', '" + runCycle + "', '" + nextRunDate + "', '" + enabled + "');";
            pool.query(addQuery, (err, re, fe) => {
                if (err) console.log(err)
                else {
                    console.log('new connection add success!')
                    resolve('success')
                }
            })
        })
    },

    'reomoveZoho': function ( {id} ) {
        const query = "SELECT * FROM clientZoho WHERE id = '" + id + "'"
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results, fields) => {
                if (error) reject(error)
                else {
                    if (results.length != 0) {
                        const removeQuery = "DELETE FROM `coreedit`.`clientZoho` WHERE (`id` = '" + id + "');";
                        pool.query(removeQuery, (err, re, fe) => {
                            if (err) console.log(err)
                            else {
                                console.log('One Zoho remove success!')
                                resolve('success')
                            }
                        })
                    }
                    else resolve('Oooooops... Can\'t remove this Zoho.')
                }
            })
        })
    },

    'updateZoho': function ({id, company_name, consumer_key, consumer_secret, admin_user_name, admin_user_password, base_api_url, access_token, access_token_secret, synch_page_size, sales_type, customer_identified_by, product_name, print_name_to_short_description, enabled }) {
        const query = "SELECT * FROM clientZoho WHERE id = '" + id + "'"
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results, fields) => {
                if (error) reject(error)
                else {
                    if (results.length != 0) {
                        let _enabled = enabled ? 1 : 0;
                        let _print_name_to_short_description = print_name_to_short_description ? 1 : 0;
                        const updateQuery = "UPDATE `coreedit`.`clientZoho` SET company_name='" + company_name + "', consumer_key='" + consumer_key + "', consumer_secret='" + consumer_secret + "', admin_user_name='" + admin_user_name + "', admin_user_password='" + admin_user_password + "', base_api_url='" + base_api_url + "', access_token='" + access_token + "', access_token_secret='" + access_token_secret + "', synch_page_size='" + synch_page_size + "', sales_type='" + sales_type + "', customer_identified_by='" + customer_identified_by + "', product_name='" + product_name + "', print_name_to_short_description='" + _print_name_to_short_description + "', enabled='" + _enabled + "'WHERE id=" + id
                        pool.query(updateQuery, (err, re, fe) => {
                            if (err) console.log(err)
                            else {
                                console.log('Zoho Update success!')
                                resolve('success')
                            }
                        })
                    }
                    else resolve('Ooooooooooooooooooopps ! ! !')
                }
            })
        })
    },
    
    'getAccessToken': function ({tempAccount: tempAccount}) {
        console.log(tempAccount);
        return new Promise((resolve, reject) => {
            const Zoho = require('zoho-api');
            const path = require('path');
            const base = path.resolve('.');

            const api = new Zoho.Api({
                clientId: tempAccount.client_id,
                clientSecret: tempAccount.client_secret,
                tokenFile: base + '/../../../../../tokens.json', // Absolute path from current directory
                setup: true
            });

            const fetchApi = new Zoho.Api({
                clientId: tempAccount.client_id,
                clientSecret: tempAccount.client_secret,
                tokenFile: base + '/../../../../../tokens.json', // Absolute path from current directory
            });

            function fetchData(sourceType, erpAccount, jsonData) {

            }

            api.setup(tempAccount.authorization_code)
                .then((response) => {
                    console.log('Tokens file generated!');
                    console.log(response);

                    fetchApi.api('GET', '/Leads')
                        .then((response) => {
                            console.log('Got data!');

                            Meteor.call(`getTrueERPFromId`, {id: tempAccount.id}, (err, result) => {
                                if (err)
                                    console.log(err);
                                else {
                                    let erpAccount = result[0];
                                    let text;

                                    for(let i = 0 ; i < response.data.data.length ; i ++) {
                                        let jsonData = {
                                            "type": "TProspect",
                                            "fields": {
                                                "Active": true,
                                                "AltPhone": "",
                                                "AssessorsName": "",
                                                "BailmentAmountEx": 0,
                                                "BailmentNumber": "",
                                                "Billcountry": "",
                                                "BillPostcode": "4113",
                                                "BillState": "Qld",
                                                "BillStreet": "Hunters Shack",
                                                "BillStreet2": "2 Sherwood Forest",
                                                "BillStreet3": "",
                                                "Billsuburb": "8 MILE PLAINS",
                                                "BodyType": "",
                                                "ClaimNumber": "",
                                                "ClientCustomFieldValues": null,
                                                "ClientName": response.data.data[i].Company,
                                                "ClientPaysShippment": false,
                                                "ClientShipperAccountNo": "",
                                                "Colour": "",
                                                "Companyname": response.data.data[i].Company,
                                                "CompanyTypeName": "Unknown",
                                                "Contacts": [],
                                                "Country": response.data.data[i].Country,
                                                "CreationDate": "",
                                                "CUSTDATE1": "",
                                                "CUSTFLD3": "",
                                                "CUSTFLD4": "",
                                                "DefaultAPAccount": "",
                                                "DefaultARAccount": "",
                                                "DefaultSOTemplateID": 0,
                                                "DontContact": false,
                                                "Email": response.data.data[i].Email,
                                                "EmpID": 0,
                                                "EmpName": "",
                                                "ExcessAmount": 0,
                                                "ExternalRef": "",
                                                "Faxnumber": "",
                                                "FirstName": response.data.data[i].First_Name,
                                                "ForcePOOnSalesOrder": false,
                                                "FTPAddress": "",
                                                "FTPPassword": "",
                                                "FTPUserName": "",
                                                "IsCustomer": true,
                                                "ISEmpty": false,
                                                "IsJob": false,
                                                "IsOtherContact": true,
                                                "IsSupplier": false,
                                                "KeyStringFieldName": "Company",
                                                "KeyValue": "Apple Corp",
                                                "LastName": response.data.data[i].Last_Name,
                                                "LicenseRenewDuration": 1,
                                                "Mobile": response.data.data[i].Mobile,
                                                "MsTimeStamp": response.data.data[i].Created_Time,
                                                "MsUpdateSiteCode": "DEF",
                                                "NewOrUsed": "",
                                                "Notes": "",
                                                "OtherFollowUps": null,
                                                "Phone": response.data.data[i].Phone,
                                                "Postcode": response.data.data[i].Zip_Code,
                                                "PrintName": response.data.data[i].Company,
                                                "ProductGroupDiscount": [],
                                                "PublishOnVS1": false,
                                                "Recno": response.data.data[i].Owner.id,
                                                "RepName": response.data.data[i].Owner.name,
                                                "SendFTPXMLInvoices": false,
                                                "SendFTPXMLPOs": false,
                                                "SkypeName": response.data.data[i].Skype_ID,
                                                "SourceName": "Referral",
                                                "State": response.data.data[i].State,
                                                "Status": "Burden Expense",
                                                "StockReceivedDate": 0,
                                                "StormDate": "",
                                                "StormLocation": "",
                                                "Street": response.data.data[i].Street,
                                                "Street2": "2 Sherwood Forest",
                                                "Street3": "",
                                                "Suburb": "8 MILE PLAINS",
                                                "Title": response.data.data[i].Salutation,
                                                "URL": response.data.data[i].Website,
                                                "Year": ""
                                            }
                                        }

                                        HTTP.call('POST', `${erpAccount.base_url}/TProspect`, {
                                            headers: {
                                                'Username': `${erpAccount.user_name}`,
                                                'Password': `${erpAccount.password}`,
                                                'Database': `${erpAccount.database}`,
                                            },
                                            data: jsonData
                                        }, (error, response) => {
                                            if (error)
                                                console.error('Error:', error);
                                            else {
                                                text += `1 Lead Successfully Added to TrueERP with ID Number ${response.data.fields.ID}\n`
                                                console.log(text);
                                            }
                                            // if( i == productCount - 1)
                                            //     fetchOrder(lstUpdateTime, token, selConnectionId, text);
                                        });
                                    }
                                }
                            })

                        })
                        .catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                })
                .catch((err) => {
                    console.log('Something failed!');
                    console.log(err);

                    fetchApi.api('GET', '/Leads')
                        .then((response) => {
                            console.log('Got data!');
                        })
                        .catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                });
        });
    },
});
