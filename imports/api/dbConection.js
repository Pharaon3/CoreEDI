// @ts-nocheck

import mysql from 'mysql';
import { config } from '../../config/config';
import { JsonRoutes } from 'meteor/simple:json-routes';
import bodyParser from 'body-parser';
const axios = require('axios').default;

// const pool = createPool({
//   host: config.host,
//   user: config.user,
//   password: config.password,
//   database: config.database,
//   charset: config.charset // Required for MySQL 8
// });

const jsonParser = bodyParser.json();

var db_config = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
};

var pool;

function handleDisconnect() {
  pool = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  pool.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  pool.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

Meteor.startup(() => {

  JsonRoutes.add('post', '/api/admin/verify/email', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM users WHERE email = '" + data.email + "'"
      pool.query(query, function (error, results) {
        if (results.length == 0) {
          const query2 = "SELECT * FROM customers WHERE logon_name = '" + data.email + "'"
          pool.query(query2, function (error, result) {
            if (error) {
              return JsonRoutes.sendResult(res, {
                code: '500',
                data: error
              });
            }
            return JsonRoutes.sendResult(res, {
              data: {
                result: result,
                super: false
              }
            })
          })
        }
        else return JsonRoutes.sendResult(res, {
          data: {
            result: results,
            super: true
          }
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/admin/signup', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM users WHERE email = '" + data.useremail + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length == 0) {
            const addquery = "INSERT INTO users (username, password, email, companyid ) VALUES ('" + data.username + "', '" + data.userpassword + "', '" + data.useremail + "'," + 1 + ")";
            pool.query(addquery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              data: 'Email address already used.'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/customers', function (req, res) {
    jsonParser(req, res, () => {
      const query = 'SELECT * FROM customers'
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/customersByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM customers WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/employees', function (req, res) {
    jsonParser(req, res, () => {
      const query = 'SELECT * FROM employees'
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/connections', function (req, res) {
    jsonParser(req, res, () => {
      const query = 'SELECT\n' +
        '    c.id,\n' +
        '    c.customer_id,\n' +
        '    c.db_name,\n' +
        '    s1.name AS account_name,\n' +
        '    s2.name AS connection_name,\n' +
        '    c.last_ran_date,\n' +
        '    c.run_cycle,\n' +
        '    c.next_run_date,\n' +
        '    c.enabled\n' +
        'FROM\n' +
        '    connections c\n' +
        'JOIN\n' +
        '    softwares s1 ON c.account_id = s1.id\n' +
        'JOIN\n' +
        '    softwares s2 ON c.connection_id = s2.id;\n'
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/connectionsByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM connections WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/connectionsByCustomerID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT\n' +
        '    c.id,\n' +
        '    c.customer_id,\n' +
        '    c.db_name,\n' +
        '    s1.name AS account_name,\n' +
        '    s2.name AS connection_name,\n' +
        '    c.last_ran_date,\n' +
        '    c.run_cycle,\n' +
        '    c.next_run_date,\n' +
        '    c.enabled\n' +
        'FROM\n' +
        '    connections c\n' +
        'JOIN\n' +
        '    softwares s1 ON c.account_id = s1.id\n' +
        'JOIN\n' +
        '    softwares s2 ON c.connection_id = s2.id\n' +
        'WHERE c.customer_id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/connectionsSoftwareByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT\n' +
        '    s1.name AS account_name,\n' +
        '    s2.name AS connection_name\n' +
        'FROM\n' +
        '    connections c\n' +
        'JOIN\n' +
        '    softwares s1 ON c.account_id = s1.id\n' +
        'JOIN\n' +
        '    softwares s2 ON c.connection_id = s2.id\n' +
        'WHERE\n' +
        '    c.id = ' + data.id;
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/employeesByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM employees WHERE no='" + data.id + "'"
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/TrueERPByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clienttrueerp WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/MagentoByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientmagento WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/WooCommerceByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientwoocommerce WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/ZohoByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientzoho WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/XeroByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientxero WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/AmazonByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientamazon WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/Route4MeByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientroute4me WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/XeroSageAccounting', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM clientsageaccounting WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('post', '/api/updateMagento', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM clientmagento WHERE id = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            let _enabled = data.enabled ? 1 : 0;
            let _print_name_to_short_description = data.print_name_to_short_description ? 1 : 0;
            const updateQuery = "UPDATE `coreedit`.`clientmagento` SET company_name='" + data.company_name + "', consumer_key='" + data.consumer_key + "', consumer_secret='" + data.consumer_secret + "', admin_user_name='" + data.admin_user_name + "', admin_user_password='" + data.admin_user_password + "', base_api_url='" + data.base_api_url + "', access_token='" + data.access_token + "', access_token_secret='" + data.access_token_secret + "', synch_page_size='" + data.synch_page_size + "', sales_type='" + data.sales_type + "', customer_identified_by='" + data.customer_identified_by + "', product_name='" + data.product_name + "', print_name_to_short_description='" + _print_name_to_short_description + "', enabled='" + _enabled + "'WHERE id=" + data.id
            pool.query(updateQuery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/updateTrueERP', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM clienttrueerp WHERE id = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            let _enabled = data.enabled ? 1 : 0;
            const updateQuery = "UPDATE `coreedit`.`clienttrueerp` SET user_name='" + data.user_name + "', password='" + data.password + "', `database`='" + data.database + "', base_url='" + data.base_url + "', enabled='" + _enabled + "' WHERE id=" + data.id
            pool.query(updateQuery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/addEmployee', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM employees WHERE employeeEmail = '" + data.email + "'";
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length == 0) {
            const addquery = "INSERT INTO `coreedit`.`employees` (`employeeName`, `employeeEmail`, `title`, `firstName`, `middleName`, `lastName`, `suffix`, `phone`, `mobile`, `fax`, `skypeId`, `gender`) VALUES ('" + data.employeeName + "', '" + data.email + "', '" + data.title + "', '" + data.firstName + "', '" + data.middleName + "', '" + data.lastName + "', '" + data.suffix + "', '" + data.phone + "', '" + data.mobile + "', '" + data.fax + "', '" + data.skypeID + "', '" + data.gender + "');";
            pool.query(addquery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/updateEmployee', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM employees WHERE no = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            const updatequery = "UPDATE `coreedit`.`employees` SET employeeName='" + data.employeeName + "', employeeEmail='" + data.email + "', title='" + data.title + "', firstName='" + data.firstName + "', middleName='" + data.middleName + "', lastName='" + data.lastName + "', suffix='" + data.suffix + "', phone='" + data.phone + "', mobile='" + data.mobile + "', fax='" + data.fax + "', skypeId='" + data.skypeID + "', gender='" + data.gender + "' WHERE no='" + data.id + "'";
            pool.query(updatequery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/removeEmployee', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM employees WHERE no = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            const removequery = "DELETE FROM `coreedit`.`employees` WHERE (`no` = '" + data.id + "');";
            pool.query(removequery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/addCustomer', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM customers WHERE email = '" + data.email + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length == 0) {
            const addquery = "INSERT INTO `coreedit`.`customers` (`globalRef`, `name`, `email`, `country`, `address`, `phone`, `note`, `Mobile`, `citySubhurb`, `state`, `zipcode`, `accountNo`, `customerType`, `disCount`, `termName`, `firstName`, `middleName`, `lastName`, `companyName`, `fax`, `skypeID`, `website`, `logon_name`, `logon_password`) VALUES ('','" + data.companyName + "' , '" + data.email + "', '', '', '" + data.phone + "', '', '" + data.mobile + "', '', '', '', '0', '', '', '" + data.firstName + ' ' + data.middleName + ' ' + data.lastName + "', '" + data.firstName + "', '" + data.middleName + "', '" + data.lastName + "', '" + data.companyName + "', '" + data.fax + "', '" + data.skypeID + "', '" + data.website + "', '" + data.logon_name + "', '" + data.logon_password + "');";
            pool.query(addquery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              data: 'email used'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/updateCustomer', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM customers WHERE id = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            const updatequery = "UPDATE `coreedit`.`customers` SET" +
              " name='" + data.companyName +
              "', email='" + data.email +
              "', firstName='" + data.firstName +
              "', middlename='" + data.middleName +
              "', lastName='" + data.lastName +
              "', phone='" + data.phone +
              "', Mobile='" + data.mobile +
              "', fax = '" + data.fax +
              "', skypeID='" + data.skypeID +
              "', website='" + data.website +
              "', logon_name='" + data.logon_name +
              "', logon_password='" + data.logon_password +
              "' WHERE id=" + data.id
            pool.query(updatequery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/removeCustomer', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM customers WHERE id = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            const removequery = "DELETE FROM `coreedit`.`customers` WHERE (`id` = '" + data.id + "');";
            pool.query(removequery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

  JsonRoutes.add('post', '/api/softwareByID', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = 'SELECT * FROM softwares WHERE id=' + data.id
      pool.query(query, function (error, results) {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        return JsonRoutes.sendResult(res, {
          data: results
        });
      });
    });
  });

  JsonRoutes.add('POST', '/api/magentoAdminToken', async function (req, res) {

    ////// admin token ////////////
    await axios({
      method: 'post',
      url: req.body.url + '/rest/V1/integration/admin/token?username=' + req.body.username + '&password=' + req.body.password
    })
      .then((result) => {
        adminToken = result.data;
        JsonRoutes.sendResult(res, {
          data: adminToken
        });
      })
      .catch((error) => {
        return JsonRoutes.sendResult(res, {
          code: '500',
          data: error
        });
      })
  });

  JsonRoutes.add('POST', '/api/getMCustomers', async function (req, res) {
    await axios({
      method: 'GET',
      url: req.body.url + "/rest/all/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=updated_at&searchCriteria[filter_groups][0][filters][0][value]=${lstUpdateTime}&searchCriteria[filter_groups][0][filters][0][condition_type]=gt",
      headers: {
        'Authorization': req.body.auth,
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        JsonRoutes.sendResult(res, {
          data: result.data
        });
      })
      .catch((error) => {
        return JsonRoutes.sendResult(res, {
          code: '500',
          data: error
        });
      })
  })

  JsonRoutes.add('GET', '/api/transactions', async function (req, res) {
    const query1 = `SELECT a.id, a.date, a.order_num, a.products_num, b.name as accounting_soft, c.name as connection_soft, d.name as product_name
                  FROM (SELECT * FROM transactions) AS a 
                  LEFT JOIN (SELECT * FROM softwares) AS b ON a.accounting_soft = b.id
                  LEFT JOIN (SELECT * FROM softwares) AS c ON a.connection_soft = c.id
                  LEFT JOIN (SELECT * FROM products) AS d ON a.products = d.id`;
    // const query = 'SELECT * FROM transactions';
    pool.query(query1, function (error, results) {
      // console.log(results)
      if (error) {
        return JsonRoutes.sendResult(res, {
          code: '500',
          data: error
        });
      }
      return JsonRoutes.sendResult(res, {
        data: results
      });
    });
  });

  JsonRoutes.add('post', '/api/updateLastRanDate', function (req, res) {
    jsonParser(req, res, () => {
      const data = req.body;
      const query = "SELECT * FROM connections WHERE id = '" + data.id + "'"
      pool.query(query, (error, results, fields) => {
        if (error) {
          return JsonRoutes.sendResult(res, {
            code: '500',
            data: error
          });
        }
        else {
          if (results.length != 0) {
            const updateQuery = "UPDATE `coreedit`.`connections` SET last_ran_date='" + data.last_ran_date + "' WHERE id=" + data.id
            pool.query(updateQuery, (err, re, fe) => {
              if (err) console.log(err)
              else {
                return JsonRoutes.sendResult(res, {
                  data: 'success'
                });
              }
            })
          }
          else {
            return JsonRoutes.sendResult(res, {
              code: '500',
              data: 'Ooooooooooooooooooopps ! ! !'
            });
          }
        }
      })
    });
  });

})

export default pool;
