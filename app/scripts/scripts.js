$(document).ready(function() {

	var advanceTask = function(task) {
  	var modified = task.innerText.trim()
 	 for (var i = 0; i < listo.length; i++) {
   		 if (listo[i].task === modified) {
    	  if (listo[i].id === 'new') {
       		 listo[i].id = 'inProgress';
       		 updateStorage(listo[i]);
     	 } else if (listo[i].id === 'inProgress') {
     	     listo[i].id = 'archived';
     	     updateStorage(listo[i]);
     	 } else { //if task has no id, remove it
     	 	localStorage.removeItem(listo[i].task);
     	   listo.splice(i, 1);
    	  }
      break;
  	      }
	  }
 	 task.remove();
	};


	$(document).on('click', '#item', function(e) {    //in this line, #item is specifying what we are affecting when we click
   		 e.preventDefault();  //prevents default action for event from being triggered
   		 var task = this; //so we can pass the 'this' keyword into the advanceTask function
   	 	 advanceTask(task);
   	 	 this.id = 'inProgress'; //change task.id to 'inProgress'
   		 $('#currentList').append(this.outerHTML);      
	});


	$(document).on('click', '#inProgress', function (e) {
 	 	e.preventDefault();
 		var task = this;  //so we can pass the 'this' keyword into another function
 	 	task.id = "archived";  //change task.id to 'archived'
	 	var changeIcon = task.outerHTML.replace('glyphicon-arrow-right', 'glyphicon-remove');
 	 	advanceTask(task);
 	 	$('#archivedList').append(changeIcon);
	});

	$(document).on('click', '#archived', function(e) {  //deletes task
		e.preventDefault();
		var task = this;
		advanceTask(task);
	})



	$('#newTaskForm').hide(); //hides newTaskForm when page loads

	var listo = [];  //main array for storing tasks

	var Task = function(task) {  //constructor function for tasks
		this.task = task;
		this.id = 'new';
	}

	var addTask = function(task) {
		if (task) {                //ensures users don't create blank tasks
			task = new Task(task); //constructs new task object,
			listo.push(task);	   //pushes to list array
			updateStorage(task);  //adds task to localStorage object
    		if (localStorage['taskArray']) { //if there is already a task array
      		  localStorage['taskArray'] += "." + task.task; //add new task to it
      		} else {
      		  localStorage['taskArray'] = task.task; //if not, create new task
     		 }

			$('#newItemInput').val('');  //clear input after submitting it
			$('#newList').append(
				 '<a href="#finish" class="" id="item">' +
                 '<li class="list-group-item">' +
                 '<h3>' + task.task + '</h3>'+
                 '<span class="arrow pull-right">' +
                 '<i class="glyphicon glyphicon-arrow-right">' +
                 '</span>' +
                 '</li>' +
                 '</a>'
				);                       //append this html to #newList
		}
	}

	$('#newTaskForm').slideToggle('fast', 'linear');    //toggle new button to hide and show input form at same time

	$('#saveNewItem').on('click', function(e) {         //calls addTask function when we click the saveNewItem button
		e.preventDefault();
		var task = $('#newItemInput').val().trim();
		addTask(task);
	});


	//opens form
	$('#add-todo').on('click', function() {             //open new task form on click
		$('#newTaskForm').fadeToggle('fast', 'linear');
	});
	//closes form
	$('#cancel').on('click', function(e) {              //close new task form on click
		e.preventDefault();
		$('#newTaskForm').fadeToggle('fast', 'linear');
	});



	 var updateStorage = function(task) {
  	  if (localStorage[task.task]) {
      	localStorage.setItem(task.task, task.task + "." + task.id)
   	  } else {
      	localStorage[task.task] = task.task + "." + task.id;
   	  }
  	}

  	 // If local storage exists, retrieve it and call addTask on each item.
 	 var retrieveStorage = function() {
    if (!localStorage['taskArray']) { return }
    var arr = localStorage['taskArray'].split('.');
    var appendTask =
    arr.forEach(function(item) {
      if (item === "undefined") { return }
      if (!localStorage[item]) { return }
      var itemO = localStorage[item];
      var objArr = itemO.split('.');
      var task = new Task(objArr[0], objArr[1]);
      listo.push(task);
      if (task.id === 'new') {
        $('#newList').append('<a href="#finish" class="" id="item"><li class="list-group-item">' + task.task + '<span class="arrow pull-right"><i class="glyphicon glyphicon-arrow-right"></span></li></a>');
      } else if (task.id === 'inProgress') {
        $('#currentList').append('<a href="#finish" class="" id="item"><li class="list-group-item">' + task.task + '<span class="arrow pull-right"><i class="glyphicon glyphicon-arrow-right"></span></li></a>');
      } else if (task.id === 'archived'){
        $('#archivedList').append('<a href="#finish" class="" id="item"><li class="list-group-item">' + task.task + '<span class="arrow pull-right"><i class="glyphicon glyphicon-arrow-right"></span></li></a>');

      }
    })
  }
})