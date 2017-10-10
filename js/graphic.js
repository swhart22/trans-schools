/******************
INITIALIZE ELEMENTS
******************/
var graphic = document.querySelector('#graphic'),
	flex = document.createElement('div'),
	left = document.createElement('div'),
	right = document.createElement('div'),
	logo = document.createElement('div'),
	dropdown = document.createElement('select'),
	enrollmentCont = document.createElement('div'),
	tableCont = document.createElement('div'),
	table = document.createElement('table'),
	notes = document.createElement('div');
flex.classList.add('flex');
left.classList.add('left');
right.classList.add('right');
logo.classList.add('logo');
dropdown.classList.add('form-control','form-control-lg','drop');
enrollmentCont.classList.add('enrollment');
table.classList.add('table-container');
tableCont.appendChild(table);
notes.classList.add('notes');

left.appendChild(logo);


right.appendChild(tableCont);

flex.appendChild(left);
flex.appendChild(right);

graphic.appendChild(dropdown);
graphic.appendChild(flex);

graphic.appendChild(enrollmentCont);
graphic.appendChild(notes);

var colors = {"red": {"001": "#6D2415","002": "#A23623","003": "#D8472A","004": "#E27660","005": "#EBA295","006": "#F3D0CA"
   },"blue": {"001": "#28566F","002": "#3E7FA5","003": "#53A9DC","004": "#80BEE4","005": "#A8D4EE","006": "#D2E8F5"},
   "green": {"001": "#4A5E40","002": "#6E8E5E","003": "#D8472A","004": "#91BC7F","005": "#C9DDBE","006": "#E2EDDE"},"purple": {"001": "#35203B","002": "#503058","003": "#6A4177","004": "#8D7097","005": "#B49FB9","006": "#DACFDD"},"yellow": {"001": "#776428","002": "#B19330","003": "#EEC535","004": "#F3D469","005": "#F7E299","006": "#FAF0CD"},"black": {"001": "#000000","002": "#4D4D4D","003": "#807F7F","004": "#C0C0C0","005": "#DBDBDA","006": "#F7F7F7"}};

/********
PULL DATA
********/
d3.csv('data/schools.csv',(error, data) => {
	if (error) throw error; 

	render(data);
});

/*****************
RENDER THE GRAPHIC
*****************/
function render(data){
	console.log(data);
	_.forEach(data, d => {
		var district = d['District'];
		var option = document.createElement('option');
		option.value = district;
		option.text = district;

		dropdown.appendChild(option);

	});
	//create table
	
	var trainees = [' ', 'Teachers', 'Other Staff', 'Students'];
	var levels = ['Elementary', 'Middle', 'High'];

	var thead = document.createElement('tr');

	_.forEach(trainees, t => {
		var hcol = document.createElement('th');
		hcol.innerHTML = t;
		thead.append(hcol);
	});

	table.append(thead);

	_.forEach(levels, l => {
		var row = document.createElement('tr');
		row.classList.add(l.toLowerCase());
		table.append(row);

		_.forEach(trainees, (t, i) => {
			var col = document.createElement('td');
			
			row.append(col);

			if (t == ' '){
				col.classList.add('level');
				col.innerHTML = l;
			}
			else{
				col.classList.add(t.split(' ')[0].toLowerCase());
				col.innerHTML = '<span class="glyphicon glyphicon-ok yes"></span>';
				col.innerHTML += '<span class="star1">*</span><span class="star2">*</span>';
				col.innerHTML += '  <span class="glyphicon glyphicon-remove no"></span>';
				col.innerHTML += '<span class="star3">***</span>';
				
			}
		})
	});

	var value = dropdown.value;

	var somstars = document.querySelectorAll('.star1, .star2');
	var nastars = document.querySelectorAll('.star3');
	_.forEach(somstars, el => {
		el.style.color = colors['yellow']['004'];
	});
	_.forEach(nastars, el =>{
		el.style.color = colors['black']['004'];
	})
	//add key and footnotes
	var key = document.createElement('div');
	key.classList.add('key');
	key.innerHTML = '<span class="glyphicon glyphicon-ok" style="color:'+ colors['green']['004']+ '"></span> Training Offered<br /> ';
	key.innerHTML += '<span class="glyphicon glyphicon-ok" style="color:'+ colors['yellow']['004']+ '"></span> Training Sometimes Offered<br /> ';
	key.innerHTML += '<span class="glyphicon glyphicon-remove" style="color:'+ colors['red']['004']+ '"></span> Training Not Offered<br /> ';
	key.innerHTML += '<span style="color:'+ colors['yellow']['004']+'">*</span> Training only offered if trans students enrolled at school.<br />';
	key.innerHTML += '<span style="color:'+ colors['yellow']['004']+'">**</span> Training only offered to health teachers.<br />';
	key.innerHTML += '<span style="color:'+ colors['black']['004']+'">***</span> Data unavailable.<br />';
	right.append(key);

	function populate (){
		var datum = [];
		
		_.forEach(data, d => {
			if (d['District'] == value){
				datum.push(d);
			}
		});
		enrollmentCont.innerHTML = '<strong>Enrollment:</strong> '+ datum[0]['Enrollment'];
		
		var keys = [
			{'data':'TEACHER TRAIN - ELEM','val':'.elementary .teachers'},
			{'data':'TEACHER TRAIN - HIGH','val':'.high .teachers'},
			{'data':'TEACHER TRAIN- MIDDLE','val':'.middle .teachers'},
			{'data':'STAFF TRAIN - ELEM', 'val':'.elementary .other'},
			{'data':'STAFF TRAIN - MIDDLE', 'val':'.middle .other'},
			{'data':'STAFF TRAIN - HIGH', 'val':'.high .other'},
			{'data':'STUDENT TRAIN - ELEM', 'val':'.elementary .students'},
			{'data':'STUDENT TRAIN - MIDDLE', 'val':'.middle .students'},
			{'data':'STUDENT TRAIN - HIGH', 'val':'.high .students'}
		];
		
		var logoPathTo = './images/logos/';
		var logoURL = datum[0]['relative'];
		var logo_ = logoPathTo + logoURL;

		function check(entry){
			if (entry == 'Yes'){return [colors['green']['004'], colors['black']['004']]}
			else if (entry == 'No'){return [colors['black']['004'], colors['green']['004']]}
			else if (entry == 'NA'){return [colors['black']['004'], colors['black']['004']]}
			
			else {return [colors['yellow']['004'], colors['black']['004']]};

		}
		function stars(entry){
			if (entry == 'Sometimes*'){return [1, 0, 0]}
			else if (entry == 'Sometimes**'){return [1, 1, 0]}
			else if (entry == 'NA'){return [0, 0, 1]}
			else {return [0, 0, 0]};
		}

		_.forEach(keys, k =>{
			document.querySelector(k['val'] + ' .yes').style.color = check(datum[0][k['data']])[0];
			document.querySelector(k['val'] + ' .no').style.color = check(datum[0][k['data']])[1];

			document.querySelector(k['val'] + ' .star1').style.opacity = stars(datum[0][k['data']])[0];
			document.querySelector(k['val'] + ' .star2').style.opacity = stars(datum[0][k['data']])[1];
			document.querySelector(k['val'] + ' .star3').style.opacity = stars(datum[0][k['data']])[2];
		})

		logo.innerHTML = '';
		var logoImg = logo.appendChild(document.createElement('img'));
		logoImg.classList.add('logo-img');
		logoImg.src = logo_;

		if (datum[0]['additional comments for web'] == ''){
			document.querySelector('.notes').innerHTML = '';
		}
		else{
			document.querySelector('.notes').innerHTML = '<p><strong>Note:</strong> ' + datum[0]['additional comments for web'] + '</p>';
		}
	};

	populate();

	//manage dropdown
	dropdown.onchange = () => {

		value = dropdown.value;
		datum = [];
		
		populate();		
	};
};