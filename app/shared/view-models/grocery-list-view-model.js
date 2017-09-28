var config = require("../../shared/config");
var ObservableArray = require("data/observable-array").ObservableArray;

function GroceryListViewModel(items) {
    var viewModel = new ObservableArray(items);
    viewModel.load = function() {
        return fetch(config.MuskiAPIUrl + "groceries", {
            // headers: {
            //     "Authorization": "Bearer " + config.token
            // }
        })
        .then(handleErrors)
        .then(function(response) {
            console.log("status:"+ response.status);
            return response.json();            
        }).then(function(data) {
            data.forEach(function(grocery) {
                console.log(grocery.name+"****"+grocery._id);
                viewModel.push({
                    name: grocery.name,
                    id: grocery._Id
                });
            });
        });
    };
    
    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };
    viewModel.add = function(grocery) {
        return fetch(config.MuskiAPIUrl + "groceries", {
            method: "POST",
            body: JSON.stringify({
                name: grocery
            }),
            headers: {
                // "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.dir(data);
            viewModel.push({ name: grocery, id: data._id });
        });
    };
    viewModel.remove = function(grocery) {
        console.dir(grocery);
        return fetch(config.MuskiAPIUrl + "groceries/"+grocery.id, {
            method: "Delete"
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        });
    };
    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = GroceryListViewModel;