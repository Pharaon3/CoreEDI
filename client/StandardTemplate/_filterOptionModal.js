import { ReactiveVar } from "meteor/reactive-var";
import "./_filterOptionModal.html";
// import {DailyFrequencyModel, MonthlyFrequencyModel, OneTimeOnlyFrequencyModel, OnEventFrequencyModel, WeeklyFrequencyModel} from "./Model/FrequencyModel";
import LoadingOverlay from "../LoadingOverlay";
import CachedHttp from "../CachedHttp";
import erpObject from "../erp-objects";
import CurrencyApi from "../API/CurrencyApi";
// import {updateAllCurrencies} from "./currencies";
import CronSetting from "../CronSetting";
import moment from "moment";

const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");

let currentDate = new Date();
let currentFormatedDate = currentDate.getDay() + "/" + currentDate.getMonth() + "/" + currentDate.getFullYear();

let fxUpdateObject;

Template._filterOptionModal.onCreated(function () {
  const templateObject = Template.instance();
});

Template._filterOptionModal.onRendered(function () {
  let templateObject = Template.instance();
});

Template._filterOptionModal.events({
  'click .btnAddNewCategory': () => {
    var filterOptions = $('.productsFilter');
    var html = `<div class="row filterOption">
        <div class="col-12 col-lg-1" style="padding: 0;">
            <div class="form-group" style="margin-left: 4px;padding-left:4px; width: 80%;">
                <div class="row" style="padding-left: 20px;">
                    <button type="button" class="btn btn-danger btn-rounded btn-sm removeCategoryRowBtn"
                        style="margin-bottom: 0.5em;" onclick=removeOption(` + filterOptions.length + `)><i class="fa fa-remove"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-7" style="padding: 0;">
            <div class="row" style="padding-left: 20px;">
                <div class="form-group" style="margin-left: 4px;padding-left:4px; width: 80%;">
                    <!-- <label class="text-nowrap">
                        <h5 style="margin-bottom: 8px;">Category</h5>
                    </label> -->
                    <select class=" form-control" id="magento_cIdentify" name="cIdentify"
                        style="cursor: pointer;">
                        <option value="0">Bags</option>
                        <option value="1">Ancillary</option>
                        <option value="2">Parts/Accessories</option>
                        <option value="3">Consumables</option>
                        <option value="4">Devices</option>
                        <option value="5">Fire</option>
                    </select>
                    <!-- {{> toggle_button}} -->
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-2" style="padding: 0;">
            <div class="row" style="padding-left: 20px;">
                <div class="form-group" style="margin-left: 4px;padding-left:4px; width: 80%;">
                    <!-- <label class="text-nowrap">
                        <h5 style="margin-bottom: 8px;">Category</h5>
                    </label> -->
                    <label class="toggle">
                        <input type="checkbox">
                        <span class="labels" data-on="And" data-off="Or"></span>
                    </label>
                    <!-- {{> toggle_button}} -->
                </div>
                <!-- <div class="form-group" style="margin-left: 4px;padding-left:4px; width: 80%">
                    <div class="button r" id="button-3">
                        <input type="checkbox" class="checkbox" />
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>`;
    $(html).appendTo($('.modal-body'))
  },

  'click .removeCategoryRowBtn': (event) => {
    $(event.target).parent().parent().parent().parent().parent().remove();
  }
});
                 