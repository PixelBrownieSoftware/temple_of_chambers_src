
var canvas;
var speed = 5;
var size = 1;
const tilesize = 20;
var offsetCanvasX = 80;
var offsetCanvasY = 60;
var offsetCentre = 7;

var pl_off_x = 0;
var pl_off_y = 0;

var objects = [];
var entities = [];
var ITEMS = [];

var selected_item = 0;

var tick = 1;
var walkdel = 0;
const delsec = 20;

var pl;
var pl_current_state = 0;
var pl_dir_x = 0, pl_dir_y = 0;
var pl_states = {
	MOVING: 0,
	STATIC: 1
}

var levelString = "";
var objectString = "";
var keyCodeCur = 0;

var message_steps = 0;
const max_message_steps = 5; //Steps until message dissapears
var message = "";

var mc_image = new Image();
var tiles = new Image();
var font = new Image();
var logo = new Image();
var title = new Image();
var ending = new Image();

var logo_sound = new Audio('sound/op_jingle.wav');
var destroy_rock = new Audio('sound/break.wav');
var error_sound = new Audio('sound/error.wav');
var collect_sound = new Audio('sound/get_item2.wav');
var move_boulder_sound = new Audio('sound/bash2.wav');
var fall_boulder_sound = new Audio('sound/bash.wav');
var fresh_air_sound = new Audio('sound/free.wav');

var gamestate = 0;
var GAME_STATE = {
	INTRO: 0,
	MAIN_MENU: 1,
	INSTRUCTIONS: 2,
	GAME: 3,
	ENDING: 4
}
var OBJECT_TYPE =
{
	SOLID: 0,
	ENTITY: 1,
	ITEM: 2,
	BREAKABLE: 3,
	FLOOR: 4,
	ICY_FLOOR: 5,
	DOOR: 6,
	MUD: 7,
	PUSHABLE: 8,
	PUSHABLE_AREA: 9,
	HOLE_BALL: 10,
	GOAL: 11,
	PUSHABLE_CRATE: 12
};
var KEYBD_INPUTS =
{
	KEY_UP: 38,
	KEY_DOWN: 40,
	KEY_LEFT: 37,
	KEY_RIGHT: 39,
	KEY_SPACE: 32,
	KEY_ENTER: 13,
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_K: 74,
	KEY_L: 75,
	KEY_M: 76,
	KEY_N: 77,
	KEY_O: 78,
	KEY_P: 79,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	KEY_MINUS: 187,
	KEY_PLUS: 189
};

var canv = document.querySelector('canvas');
canvas = canv.getContext('2d');

document.addEventListener("keydown",
	function (ev)
	{
		//console.log(ev.keyCode);
		keyCodeCur = ev.keyCode;
		switch (gamestate) {
			case GAME_STATE.GAME:
				if (keyCodeCur == KEYBD_INPUTS.KEY_RIGHT) {
					pl_dir_x = 1;
					pl_dir_y = 0;
					var one = CheckObjectCollisionX(pl.y + 1, pl.x + tilesize);
					var two = CheckObjectCollisionX(pl.y + tilesize - 1, pl.x + tilesize);

					var pick = CheckObjectCollisionX(pl.y + tilesize / 2, pl.x + tilesize);

					if (pick) {
						PlayerDetectObjectFront(pick);
					}


					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.x += 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_LEFT) {
					pl_dir_x = -1;
					pl_dir_y = 0;
					var one = CheckObjectCollisionX(pl.y + 1, pl.x - 1);
					var two = CheckObjectCollisionX(pl.y + tilesize - 1, pl.x - 1);
					var pick = CheckObjectCollisionX(pl.y + tilesize / 2, pl.x - 1);

					if (pick) {
						PlayerDetectObjectFront(pick);
					}
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.x -= 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_DOWN) {
					pl_dir_x = 0;
					pl_dir_y = 1;
					var one = CheckObjectCollisionY(pl.x, pl.y + tilesize);
					var two = CheckObjectCollisionY(pl.x + tilesize - 1, pl.y + tilesize);

					var pick = CheckObjectCollisionY(pl.x + tilesize / 2, pl.y + tilesize);

					if (pick) {
						PlayerDetectObjectFront(pick);
					}
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.y += 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_UP) {
					pl_dir_y = -1;
					pl_dir_x = 0;

					var one = CheckObjectCollisionY(pl.x, pl.y - 1);
					var two = CheckObjectCollisionY(pl.x + tilesize - 1, pl.y - 1);

					var pick = CheckObjectCollisionY(pl.x + tilesize / 2, pl.y - 1);

					if (pick) {
						PlayerDetectObjectFront(pick);
					}
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.y -= 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_Z) {
					var pick = null;
					if (pl_dir_x != 0) {
						if (pl_dir_x == 1)
							var pick = CheckObjectCollisionY(pl.x + (tilesize * 1), pl.y + tilesize / 2, 1, 1, null);
						else
							var pick = CheckObjectCollisionY(pl.x - 1, pl.y + tilesize / 2, 1, 1, null);
					} else
						if (pl_dir_y != 0) {

							if (pl_dir_y == 1)
								var pick = CheckObjectCollisionY(pl.x + tilesize / 2, pl.y + (tilesize * 1), 1, 1, null);
							else
								var pick = CheckObjectCollisionY(pl.x + tilesize / 2, pl.y - 1, 1, 1, null);
						}
					if (pick) {
						switch (pick.type) {

							case OBJECT_TYPE.BREAKABLE:
								if (ITEMS.length > 0) {

									if (ITEMS[selected_item].name == "PICKAXE") {
										destroy_rock.play();
										pick.type = OBJECT_TYPE.FLOOR;
										pick.offset_x = 1;
										pick.offset_y = 0;
									} else {
										if (!FindStringInList(ITEMS, "PICKAXE")) {
											error_sound.play();
											message = "You need a pickaxe.";
										}
										else
										{
											error_sound.play();
											message = "Select the pickaxe.";
										}

									}
								} else {
									error_sound.play();
									message = "You need a pickaxe.";
								}
								break;

							case OBJECT_TYPE.PUSHABLE:

								var u = CheckObjectCollisionX(pl.y + (tilesize * (pl_dir_y * -1)), pl.x + (tilesize * (pl_dir_x * -1)));
								var ou = CheckObjectCollisionX(pick.y + (tilesize * (pl_dir_y * -1)), pick.x + (tilesize * (pl_dir_x * -1)));
								if (u != null) {
									if (u.type == OBJECT_TYPE.FLOOR || 
										(u.type == OBJECT_TYPE.MUD && ITEMS[selected_item].name == "BOOTS")
										|| u.type == OBJECT_TYPE.PUSHABLE_AREA) {

										if (ou.type == OBJECT_TYPE.PUSHABLE_AREA) {

											move_boulder_sound.play();
											pl.y += (tilesize * (pl_dir_y * -1));
											pl.x += (tilesize * (pl_dir_x * -1));

											pick.y += (tilesize * (pl_dir_y * -1));
											pick.x += (tilesize * (pl_dir_x * -1));
										}
									}
								}
								break;
							case OBJECT_TYPE.PUSHABLE_CRATE:

								var u = CheckObjectCollisionX(pl.y + (tilesize * (pl_dir_y * -1)), pl.x + (tilesize * (pl_dir_x * -1)));
								var ou = CheckObjectCollisionX(pick.y + (tilesize * (pl_dir_y * -1)), pick.x + (tilesize * (pl_dir_x * -1)));
								if (u != null) {
									if (u.type == OBJECT_TYPE.FLOOR ||
										(u.type == OBJECT_TYPE.MUD && ITEMS[selected_item].name == "BOOTS")
										|| u.type == OBJECT_TYPE.PUSHABLE_AREA) {

										if (ou.type == OBJECT_TYPE.PUSHABLE_AREA) {

											move_boulder_sound.play();
											pl.y += (tilesize * (pl_dir_y * -1));
											pl.x += (tilesize * (pl_dir_x * -1));

											pick.y += (tilesize * (pl_dir_y * -1));
											pick.x += (tilesize * (pl_dir_x * -1));
										}
									}
								}
								break;

						}
					}
				}
				
				if ((keyCodeCur == KEYBD_INPUTS.KEY_UP ||
					keyCodeCur == KEYBD_INPUTS.KEY_RIGHT ||
					keyCodeCur == KEYBD_INPUTS.KEY_LEFT ||
					keyCodeCur == KEYBD_INPUTS.KEY_DOWN) && message != "")
					message_steps++;

				if (keyCodeCur == KEYBD_INPUTS.KEY_W) {
					selected_item++;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_Q) {
					selected_item--;
				}
				break;

		}
		
		switch (keyCodeCur) {
			case KEYBD_INPUTS.KEY_MINUS:
				if (size == 5)
					break;
				size += 1;
				offsetCanvasX += 80;
				offsetCanvasY += 60;
				canv.height = (16 * 10) * size;
				canv.width = (14 * 10) * size;
				break;

			case KEYBD_INPUTS.KEY_PLUS:
				if (size == 1)
					break;
				size -= 1;
				offsetCanvasX -= 80;
				offsetCanvasY -= 60;
				canv.height = (16 * 10) * size;
				canv.width = (14 * 10) * size;
				break;
		}
	}
);
document.addEventListener("keyup",
	function (ev)
	{
		keyCodeCur = -1;
	}
);

function item(name) {
	this.name = name;
	ITEMS.push(this);
}

/*
function character(image, x, y, tilex, tiley, type) {
	this.image = image;

	//Position relative to the characters
	this.x = x;
	this.y = y;

	//Position realitve to the tiles
	this.tilex = tilex;
	this.tiley = tiley;	
	this.type = type;
	objects.push(this);
}
*/
function character(x, y, tilex, tiley, type, offsetx, offsety) {
	this.offset_x = offsetx;	//Which 20x20 sprite will it be
	this.offset_y = offsety;
	this.revert_type = OBJECT_TYPE.FLOOR;

	//Position in screen
	this.x = x;
	this.y = y;

	//Position realitve to the tiles
	this.tilex = tilex;
	this.tiley = tiley;
	this.type = type;
	if (this.type == OBJECT_TYPE.ITEM ||
		this.type == OBJECT_TYPE.DOOR ||
		this.type == OBJECT_TYPE.PUSHABLE ||
		this.type == OBJECT_TYPE.PUSHABLE_CRATE)
		entities.push(this);
	else
		objects.push(this);
}
function character(x, y, tilex, tiley, type, offsetx, offsety, revert_type) {
	this.offset_x = offsetx;	//Which 20x20 sprite will it be
	this.offset_y = offsety;
	this.revert_type = revert_type;

	//Position in screen
	this.x = x;
	this.y = y;

	//Position realitve to the tiles
	this.tilex = tilex;
	this.tiley = tiley;
	this.type = type;
	if (this.type == OBJECT_TYPE.ITEM ||
		this.type == OBJECT_TYPE.DOOR ||
		this.type == OBJECT_TYPE.PUSHABLE ||
		this.type == OBJECT_TYPE.PUSHABLE_CRATE)
		entities.push(this);
	else
		objects.push(this);
}
function character(x, y, tilex, tiley, type, offsetx, offsety, itemname) {
	this.offset_x = offsetx;	//Which 20x20 sprite will it be
	this.offset_y = offsety;
	//Position relative to the characters
	this.x = x;
	this.y = y;
	this.itemname = itemname;
	this.revert_type = OBJECT_TYPE.FLOOR;

	//Position realitve to the tiles
	this.tilex = tilex;
	this.tiley = tiley;
	this.type = type;
	if (this.type == OBJECT_TYPE.ITEM ||
		this.type == OBJECT_TYPE.PUSHABLE ||
		this.type == OBJECT_TYPE.PUSHABLE_CRATE)
		entities.push(this);
	else
		objects.push(this);
}
function character(x, y, tilex, tiley, type, offsetx, offsety, itemrequire, revert_offsetx, revert_offset_y) {
	this.offset_x = offsetx;	//Which 20x20 sprite will it be
	this.offset_y = offsety;
	this.revert_type = OBJECT_TYPE.FLOOR;

	this.revert_offsetx = revert_offsetx;	//Which 20x20 sprite will this turn into when activated?
	this.revert_offset_y = revert_offset_y;

	//Position relative to the characters
	this.x = x;
	this.y = y;
	this.itemrequire = itemrequire;

	//Position realitve to the tiles
	this.tilex = tilex;
	this.tiley = tiley;
	this.type = type;
	if (this.type == OBJECT_TYPE.ITEM ||
		this.type == OBJECT_TYPE.PUSHABLE ||
		this.type == OBJECT_TYPE.PUSHABLE_CRATE)
		entities.push(this);
	else
		objects.push(this);
}
function character(x, y, tilex, tiley, type, offsetx, offsety, itemrequire, revert_offsetx, revert_offset_y, revert_type) {
	this.offset_x = offsetx;	//Which 20x20 sprite will it be
	this.offset_y = offsety;
	this.revert_type = revert_type;

	this.revert_offsetx = revert_offsetx;	//Which 20x20 sprite will this turn into when activated?
	this.revert_offset_y = revert_offset_y;

	//Position relative to the characters
	this.x = x;
	this.y = y;
	this.itemrequire = itemrequire;

	//Position realitve to the tiles
	this.tilex = tilex;
	this.tiley = tiley;
	this.type = type;
	if (this.type == OBJECT_TYPE.ITEM ||
		this.type == OBJECT_TYPE.PUSHABLE ||
		this.type == OBJECT_TYPE.PUSHABLE_CRATE)
		entities.push(this);
	else
		objects.push(this);
}

var dat = new Date();
var t = dat.getSeconds();
setInterval(Update, 5);

if (canvas)
{
	for (var i = 1; i < 3; i++) {
		size += 1;
		offsetCanvasX += 80;
		offsetCanvasY += 60;
	}
	canvas.fillStyle = "#00000";
	canvas.fillRect(0, 0, canv.width, canv.height);

	canvas.size = 4;
	canv.height = (16 * 10) * size;
	canv.width = (14 * 10) * size;
	canv.style = "border:3px solid";
	title.src = "images/title_screen.png";
	logo.src = "images/PBRS_LOGO_2019.png";
	tiles.src = "images/tileset.png";
	mc_image.src = "images/main_character.png";
	font.src = "images/font.png";

	pl = new character(0, 0, 0, 0, OBJECT_TYPE.ENTITY, 0);


	//var npc = new character("green", 2, 3);
}

function CreateLevel() {

	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";	//1
	levelString += "1111111111111111111111111111111111111111111111111111//1111111111111111111111111111111111111111111111111111111111";	//2
	levelString += "111111111111111111111111111111111111111111111111111///11111111111111133111-/////0-1111111111VVVVVVVVVVV111111111";	//3
	levelString += "11111111111111111111111111111111111111-00/-222222---//-1111111111111//////-/////111111111111VVVVVVVVV11111111111";	//4
	levelString += "1111-------1111111111111111111111111111///-222222-22111111111111111/0/////-/////--11111VVVV1VVVVVVVVVVVVVVVVVVVV";	//5
	levelString += "1111---11--1111111111111111111111111111222------2-222221111111111111111111/-111-/1L---3VVVVGVVVVVVVVVVVVVVVVVVVV";	//6
	levelString += "11111L1111111113----//1111113/////0--------2222----111111111111112//////////1/1//1L1111VVVV1VVVVVVVVVVVVVVVVVVVV";	//7
	levelString += "1111----------331111//111113///////1111111111111111111111111111112/1111111111011--L111111111111VVVVVVVVVVVVVVVVV";	//8
	levelString += "11111-11111111111111//////////11//0--ZZ---111111111111111111111111-1111111111/11/11111111111111VVVVVVVVVVVVVVVVV";	//9
	levelString += "1111/-/1111111111111111111111111111111111-1111////////0-1111111112///021/X///////11111111111111VVVVVVVVVVV111111";	//10
	levelString += "1111///-L------111111111111111111331111-1---/10///111-1------0--///1112111111////1111111111111111111111111111111";	//11
	levelString += "1111-//1111111/11111-11111111111///////01111//X13//11//113111/11122211111111111111111111111111111111111111111111";	//12
	levelString += "11111-11111111//11//0111111111111/11111////-///1-///-/////33//11111111111111111111111111111111111111111111111111";	//13
	levelString += "11111-11111111//11///111111111113///////3111///1111113311////311111111111111111111111111111111111111111111111111";	//14
	levelString += "11111111111111//-////111111111113//11113311111111111111111113311111111111111111111111111111111111111111111111111";	//15
	levelString += "1111111111111111111111111111111113311111111111111111111111111111111111111111111111111111111111111111111111111111";	//16
	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";	//17

	objectString +="----------------------------------------------------------------------------------------------------------------";	//1
	objectString +="----------------------------------------------------------------------------------------------------------------";	//2
	objectString +="----------------------------------------------------C----------------------C--C--2------------------------------";	//3
	objectString +="--------------------------------------=--0-----------CB-------------C--C---CCCCC--------------------------------";	//4
	objectString +="----1-----------------------------------0--------------------------=--C-0---0-----------------------------------";	//5
	objectString +="---------2--------------------------------------------=---------------------------------------------------------";	//6
	objectString +="--------------------------------C--------------------------------------------2----------------------------------";	//7
	objectString +="--------------------0------------C--------------------------------C---------------------------------------------";	//8
	objectString +="-------------------------0--------------------------------------------------------------------------------------";	//9
	objectString +="------------------------------------------------------------------------0---------------------------------------";	//10
	objectString +="----CCC--------------------------------=-------------------------0----2-----------------------------------------";	//11
	objectString +="--------------------P-----------0-----------0---------0---------------------------------------------------------";	//12
	objectString +="-------------------C-------------------------------0------------------------------------------------------------";	//13
	objectString +="-----2----------------------------------------------------------------------------------------------------------";	//14
	objectString +="------------------0---------------------------------------------------------------------------------------------";	//15
	objectString +="----------------------------------------------------------------------------------------------------------------";	//16
	objectString +="----------------------------------------------------------------------------------------------------------------";	//17
	/*
	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";	//1
	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";	//2
	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";	//3
	levelString += "11111------11111-----11111111-----------------111111111111111111111111111111111111111111111111111111111111111111";	//4
	levelString += "11111----------------11111111-111111111-11111-11111111111111111111111111111111111-111111111111111111111111111111";	//5
	levelString += "11111------11111-----111------3---111//-//111-----1111111111111111111111111111131-111111111111111111111111111111";	//6
	levelString += "11111111L111111111111111-11111111-111/////1111111----------111111111111111111113/03///11111111111111111111111111";	//7
	levelString += "111111-------------------11111111-111/////1111111111111111-111111111111111111333/1111/11111111111111111111111111";	//8
	levelString += "1111111111111111111-11111111------111/////1111111111111111------11111111111113///3111-11111111111111111111111111";	//9
	levelString += "1111111--11---111/////111111-111-111111-1111111111111111111/////1111111111--13/333111011111111111111111111111111";	//10
	levelString += "1111111-/////-111/////111111L111-111111-1111111111111111111/11111111111--///13-311111/11111111111111111111111111";	//11
	levelString += "111111110111/-111//11/111111-111-1111111111111111111111111//////00////---/////////0///-1111111111111111111111111";	//12
	levelString += "11111111-111/1111111101111111111------------11111111111111//////111111111111111111111--1111111111111111111111111";	//13
	levelString += "11111111-11-///0//////111111111111111111111-11111111-1111-------1111111111111111111111-1111111111111111111111111";	//14
	levelString += "11111111111---111/////111111111111111111111-1111111100///11111111111111111111111111111^1111111111111111111111111";	//15
	levelString += "11111111111111111/////1111111111--1---11111011111111/X0//11111111111111-------------------1111111111111111111111";	//16
	levelString += "11111-111111111111----3///////////-/////////3111111113/1111111111111111--111111111111111121111111111111111111111";	//17
	levelString += "111112111111111111113111111111111011111111133111111113/////////11111111-/11111111111-111121111111111111111111111";	//18
	levelString += "1111122222222-111111-111111111111/1111111111111---Z-11-111111--11111111-/11111111111-1111-1111111111111111111111";	//19
	levelString += "1111111111211--------111111111111/-------Z-------11------------11111111-X----1111111------1111111111111111VVVVVV";	//20
	levelString += "111111111121121111111111111111111111111111111111111111212222222111111111/////11111111-11111111111111111111VVVVVV";	//21
	levelString += "1111-L222221121111111111111111111111111111111111111111222211122111111111111//11111111-11111111111111111111VVVVVV";	//22
	levelString += "11111111111112222222-11111111111111111111111111-L2222222221111113L-1111-L--0/11111111-----------><v------GVVVVVV";	//23
	levelString += "1111111111111111111111111111111111111111111111111111111122222333331111111111111111111111111111111111111111VVVVVV";	//24
	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111VVVVVV";	//25
	levelString += "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111VVVVVV";	//26
	
	objectString +="----------------------------------------------------------------------------------------------------------------";	//1
	objectString +="----------------------------------------------------------------------------------------------------------------";	//2
	objectString +="----------------------------------------------------------------------------------------------------------------";	//3
	objectString +="----------------------------------------------------------------------------------------------------------------";	//4
	objectString +="---------1---------2-------------------------------------------------------------2------------------------------";	//5
	objectString +="----------------------------------------------------------------------------------------------------------------";	//6
	objectString +="----------------------------------------------------------=-----------------------------------------------------";	//7
	objectString +="-------------------------------------0-0-0----------------------------------------------------------------------";	//8
	objectString +="---------------------------------------000-------------------------------------------P--------------------------";	//9
	objectString +="-------=---------0-------------------------------------------00---------------0-----------2---------------------";	//10
	objectString +="---------------------------------------2---------------------------------0--------------------------------------";	//11
	objectString +="-----------------00---------^--------------------------------------------0--------------------------------------";	//12
	objectString +="----------------------------------------------------------------------------------------------------------------";	//13
	objectString +="--------2-------------------------------------------2----=------------------------------------------------------";	//14
	objectString +="--------------------------------------------------------0-------------------------------------------------------";	//15
	objectString +="---------------------------------=------------------0-----------------------------------------------------------";	//16
	objectString +="-----2-------------2---0-----------0----------------------------------------------------------------------------";	//17
	objectString +="--------------------------------------------------------------0---------0---------------------------------------";	//18
	objectString +="----------------------------------------------------------------------------------------------------------------";	//19
	objectString +="----------------------------------------------------------------------------------------------------------------";	//20
	objectString +="----------------------------------------------------------------------------------------------------------------";	//21
	objectString +="----v-----------------------------------------------------------------------------------------------------------";	//22
	objectString +="--------------------=--------------------------<------------------>----B----------------------------------------";	//23
	*/


	var y = 0, x = 0;

	for (var i = 0; i < levelString.length; i++) {
		if (i % 112 == 0) {
			x = 0;
			y++;
		}
		x++;

		tsx = x;
		tsy = y;
		obx = x * tilesize;
		oby = y * tilesize;

		switch (levelString[i]) {
			case '1':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.SOLID, 0, 0);
				break;

			case '-':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.FLOOR, 1, 0);
				break;

			case '2':

				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.MUD, 4, 0);
				break;

			case 'V':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.FLOOR, 7, 1);
				break;

			case '3':
				//Boulder
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.BREAKABLE, 7, 0, "PICKAXE", 1, 0);
				npc.itemrequire = "PICKAXE";
				npc.revert_type = OBJECT_TYPE.FLOOR;
				break;

			case 'I':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ICY_FLOOR, 2, 0);
				break;

			case '/':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.PUSHABLE_AREA, 3, 1);
				break;

			case '0':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.HOLE_BALL, 5, 1, OBJECT_TYPE.PUSHABLE_AREA);
				npc.revert_type = OBJECT_TYPE.PUSHABLE_AREA;
				break;

			case 'Z':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 2, 1, "RAFT", 1, 1);
				break;
			case 'X':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 8, 1, "RAFT", 0, 3);
				npc.revert_type = OBJECT_TYPE.PUSHABLE_AREA;
				break;

			case 'L':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 3, 0, "KEY", 1, 0);
				npc.revert_type = OBJECT_TYPE.FLOOR;
				break;

			case '<':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 0, 2, "Red_Key", 1, 0);
				npc.itemrequire = "RED KEY";
				npc.revert_type = OBJECT_TYPE.FLOOR;
				break;
			case 'v':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 1, 2, "Blue Key", 1, 0);
				npc.itemrequire = "BLUE KEY";
				npc.revert_type = OBJECT_TYPE.FLOOR;
				break;
			case '>':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 2, 2, "GREEN KEY", 1, 0);
				break;
			case '^':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.DOOR, 3, 2, "Purple Key", 1, 0);
				npc.itemrequire = "PURPLE KEY";
				npc.revert_type = OBJECT_TYPE.FLOOR;
				break;
			case 'G':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.GOAL, 8, 2);
				break;
		}

	}
	y = 0;
	x = 0;
	for (var i = 0; i < objectString.length; i++) {
		if (i % 112 == 0) {
			x = 0;
			y++;
		}
		x++;

		tsx = x;
		tsy = y;
		obx = x * tilesize;
		oby = y * tilesize;

		switch (objectString[i]) {
			case '2':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 5, 0, "Key");
				npc.itemname = "KEY";
				break;
			case 'C':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.PUSHABLE_CRATE, 1, 3);
				break;
			case '0':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.PUSHABLE, 4, 1);
				break;
			case 'B':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 6, 0, "BOOTS");
				npc.itemname = "BOOTS";
				break;
			case 'P':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 8, 0, "PICKAXE");
				npc.itemname = "PICKAXE";
				break;
			case '=':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 0, 1, "WD PLANK");
				npc.itemname = "RAFT";
				break;
			case '<':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 7, 2, "Red_Key");
				npc.itemname = "RED KEY";
				break;
			case 'v':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 6, 2, "Blue Key");
				npc.itemname = "BLUE KEY";
				break;
			case '>':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 5, 2, "Green Key");
				npc.itemname = "GREEN KEY";
				break;
			case '^':
				var npc = new character(obx, oby, tsx, tsy, OBJECT_TYPE.ITEM, 4, 2, "Purple Key");
				npc.itemname = "PURPLE KEY";
				break;

			case '1':
				pl.x = x * tilesize;
				pl.tilex = x;
				pl.tiley = y;
				pl.y = y * tilesize;
				break;
		}
	}

}

function CheckObject(obj) {
	if (obj != null)
	{
		if (obj.type == OBJECT_TYPE.ITEM)
		{
			collect_sound.play();
			ind = objects.indexOf(obj);
			if (ind != -1) {
				new item(obj.itemname);
				delete obj;
				objects.splice(ind, 1);
			}
			ind = entities.indexOf(obj);
			if (ind != -1) {
				new item(obj.itemname);
				delete obj;
				entities.splice(ind, 1);
			}
			message = "Found " + obj.itemname + ".";
		}
		if (obj.type == OBJECT_TYPE.BREAKABLE) {
		}
		if (obj.type == OBJECT_TYPE.PUSHABLE)
		{
			var u = CheckObjectCollisionX(obj.y + (tilesize * pl_dir_y), obj.x + (tilesize * pl_dir_x));
			if (u != null) {
				if (u.type == OBJECT_TYPE.PUSHABLE_AREA) {
					move_boulder_sound.play();
					obj.y += (tilesize * pl_dir_y);
					obj.x += (tilesize * pl_dir_x);
				}
				else if (u.type == OBJECT_TYPE.HOLE_BALL) {
					fall_boulder_sound.play();
					obj.y += (tilesize * pl_dir_y);
					obj.x += (tilesize * pl_dir_x);

					u.type = OBJECT_TYPE.PUSHABLE_AREA;
					u.offset_x = 6;
					u.offset_y = 1;

					deleteFromList(obj, objects);
					deleteFromList(obj, entities);

				}
			}
		}
		if (obj.type == OBJECT_TYPE.PUSHABLE_CRATE) {

			var u = CheckObjectCollisionX(obj.y + (tilesize * pl_dir_y), obj.x + (tilesize * pl_dir_x));
			if (u != null) {
				if (u.type == OBJECT_TYPE.PUSHABLE_AREA) {
					move_boulder_sound.play();
					obj.y += (tilesize * pl_dir_y);
					obj.x += (tilesize * pl_dir_x);
				}
			}
		}
		if (obj.type == OBJECT_TYPE.DOOR) {

			var ki = FindStringInList(ITEMS, obj.itemrequire);
			if (!ki) {
				error_sound.play();
				message = "You need a key.";
				return;
			}

			deleteFromList(findObjInList(obj.itemrequire, ITEMS), ITEMS);

			obj.offset_x = obj.revert_offsetx;
			obj.offset_y = obj.revert_offset_y;
			obj.type = obj.revert_type;

		}
		if (obj.type == OBJECT_TYPE.GOAL) {
			tick = 0;
			fresh_air_sound.play();
			message = "You have made it out.";
			gamestate = GAME_STATE.ENDING;
		}
	}
}

function findObjInList(obj, array)
{
	for (v = 0; v < array.length; v++)
	{
		if (array[v].name == obj)
		{
			console.log(obj.name);
			return array[v];
		}
	}
}

function deleteFromList(obj, array)
{
	ind = array.indexOf(obj);
	if (ind != -1) {
		delete obj;
		array.splice(ind, 1);
	}
}

function PollKeyEvents()
{
	switch (keyCodeCur) {

		case KEYBD_INPUTS.KEY_B:
			break;

		case KEYBD_INPUTS.KEY_ENTER:
			break;
		/*
		case KEYBD_INPUTS.KEY_UP:
			var objFwd = CheckObjectCollisionY(pl.tiley - 1);
			if (!CheckObject(objFwd))
				pl.y -= 1;

			console.log(pl.tiley);
			break;

		case KEYBD_INPUTS.KEY_LEFT:
			var objFwd = CheckObjectCollisionX(pl.tilex - 1);
			if (!CheckObject(objFwd))
				pl.x -= 1;

			console.log(pl.tilex);
			break;

		case KEYBD_INPUTS.KEY_RIGHT:
			var objFwd = CheckObjectCollisionX(pl.tilex + 1);
			if (!CheckObject(objFwd))
				pl.x += 1;

			console.log(pl.tilex);
			break;

		case KEYBD_INPUTS.KEY_DOWN:
			var objFwd = CheckObjectCollisionY(pl.tiley + 1);
			if (!CheckObject(objFwd))
				pl.y += 1;

			console.log(pl.tiley);
			break;
			return keyCodeCur;
			*/
	}
}

function DrawToScreen(x, y, w, h, img)
{
	if (img != null)
		canvas.drawImage(
			img,
			0,
			0,
			0,
			0,
			(x - pl.x + (offsetCentre * tilesize)) * size - offsetCanvasX,
			(y - pl.y + (offsetCentre * tilesize)) * size - offsetCanvasY,
			w * size,
			h * size);
	else
		canvas.fillRect(
			(x - pl.x + (offsetCentre * tilesize)) * size - offsetCanvasX,
			(y - pl.y + (offsetCentre * tilesize)) * size - offsetCanvasY,
			w * size,
			h * size);
}
function DrawToScreen(x, y, w, h, img, offsetx, offsety, img_size) {

	if (img != null)
		canvas.drawImage(
			img,
			w * offsetx,
			h * offsety,
			w,
			h,
			(x - pl.x + (offsetCentre * tilesize)) * size - offsetCanvasX,
			(y - pl.y + (offsetCentre * tilesize)) * size - offsetCanvasY,
			w * size,
			h * size);
	else
		canvas.fillRect(
			(x - pl.x + (offsetCentre * tilesize)) * size - offsetCanvasX,
			(y - pl.y + (offsetCentre * tilesize)) * size - offsetCanvasY,
			w * size,
			h * size);
}
	
function WriteText(x, y, text) {
	var y_pos = y;
	var x_pos = 0;
	for (var i = 0; i < text.length; i++) {

		var offset_x = 0;
		var offset_y = 3;

		switch (text[i]) {
			case 'A':
			case 'a':
				offset_x = 0;
				offset_y = 0;
				// 0,0
				break;
			case 'B':
			case 'b':
				offset_x = 1;
				offset_y = 0;
				// 1,0
				break;
			case 'C':
			case 'c':
				offset_x = 2;
				offset_y = 0;
				// 2,0
				break;
			case 'D':
			case 'd':
				offset_x = 3;
				offset_y = 0;
				// 3,0
				break;
			case 'E':
			case 'e':
				offset_x = 4;
				offset_y = 0;
				break;
				// 4,0
			case 'F':
			case 'f':
				offset_x = 5;
				offset_y = 0;
				// 5,0
				break;
			case 'G':
			case 'g':
				offset_x = 6;
				offset_y = 0;
				break;
				// 6,0
			case 'H':
			case 'h':
				offset_x = 7;
				offset_y = 0;
				// 7,0
				break;
			case 'I':
			case 'i':
				offset_x = 8;
				offset_y = 0;
				// 8,0
				break;
			case 'J':
			case 'j':
				offset_x = 9;
				offset_y = 0;
				// 9,0
				break;
			case 'K':
			case 'k':
				offset_x = 10;
				offset_y = 0;
				// 10,0
				break;
			case 'L':
			case 'l':
				offset_x = 11;
				offset_y = 0;
				// 11,0
				break;
			case 'M':
			case 'm':
				offset_x = 0;
				offset_y = 1;
				// 11,0
				break;
			case 'N':
			case 'n':
				offset_x = 1;
				offset_y = 1;
				// 0,1
				break;
			case 'O':
			case 'o':
				offset_x = 2;
				offset_y = 1;
				// 1,1
				break;
			case 'P':
			case 'p':
				offset_x = 3;
				offset_y = 1;
				// 2,1
				break;
			case 'Q':
			case 'q':
				offset_x = 4;
				offset_y = 1;
				// 3,1
				break;
			case 'R':
			case 'r':
				offset_x = 5;
				offset_y = 1;
				// 4,1
				break;
			case 'S':
			case 's':
				offset_x = 6;
				offset_y = 1;
				// 5,1
				break;
			case 'T':
			case 't':
				offset_x = 7;
				offset_y = 1;
				// 6,1
				break;
			case 'U':
			case 'u':
				offset_x = 8;
				offset_y = 1;
				// 7,1
				break;
			case 'V':
			case 'v':
				offset_x = 9;
				offset_y = 1;
				// 8,1
				break;
			case 'W':
			case 'w':
				offset_x =10;
				offset_y = 1;
				// 9,1
				break;

			case 'X':
			case 'x':
				offset_x = 11;
				offset_y = 1;
				//10,1
				break;
			case 'Y':
			case 'y':
				offset_x = 0;
				offset_y = 2;
				//11,1
				break;
			case 'Z':
			case 'z':
				offset_x = 1;
				offset_y = 2;
				//0,2
				break;
			case '1':
				offset_x = 2;
				offset_y = 2;
				//1,2
				break;
			case '2':
				offset_x = 3;
				offset_y = 2;
				//2,2
				break;
			case '3':
				offset_x = 4;
				offset_y = 2;
				//3,2
				break;
			case '4':
				offset_x = 5;
				offset_y = 2;
				//4,2
				break;
			case '5':
				offset_x = 6;
				offset_y = 2;
				//5,2
				break;
			case '6':
				offset_x = 7;
				offset_y = 2;
				//6,2
				break;
			case '7':
				offset_x = 8;
				offset_y = 2;
				//7,2
				break;
			case '8':
				offset_x = 9;
				offset_y = 2;
				//7,2
				break;
			case '9':
				offset_x = 10;
				offset_y = 2;
				//9,2
				break;
			case ':':
				offset_x = 11;
				offset_y = 2;
				break;
			case ' ':
				offset_x = 0;
				offset_y = 3;
				break;
			case '.':
				offset_x = 1;
				offset_y = 3;
				break;
			case '0':
				offset_x = 2;
				offset_y = 3;
				break;
			case '>':
				offset_x = 3;
				offset_y = 3;
				break;
			case '<':
				offset_x = 4;
				offset_y = 3;
				break;
			case '?':
				offset_x = 5;
				offset_y = 3;
				break;
			case ',':
				offset_x = 6;
				offset_y = 3;
				break;
			case '/':
				if (i + 2 > text.length) {
					break;
				}
				if (text[i + 1] == 'n') {
					var next = i + 1;
					y_pos += 10;
					x_pos = -1;
					i = next;
				}
				break;
		}
		x_pos++;		
		DrawToScreen(pl.x + -70 + (x_pos * 10), y + y_pos + pl.y + -60, 10, 10, font, offset_x, offset_y, 10);

		if (x_pos == 14) {
			y_pos += 10;
			x_pos = 0;
		}
	}
}

function Draw() {
	canvas.imageSmoothingEnabled = false;
	if (size < 1) {
		size = 1;
	}
	if (offsetCanvasX < 80) {
		offsetCanvasX = 80;
	}
	if (offsetCanvasY < 60) {
		offsetCanvasY = 60;
	}

	canvas.fillStyle = "#00000";
	canvas.fillRect(0, 0, canv.width, canv.height);

	switch (gamestate) {
		case GAME_STATE.INTRO:
			WriteText(0, 0, message);
			if (tick == 200) {
				logo_sound.play();
			}
			if (tick >= 200) {
				DrawToScreen(-40, -55, 109, 94, logo, 0, 0, 109);
			}
			if (tick == 500) {
				for (var i = 0; i < 155; i++)
					message += " ";
				message += "presents...";
				DrawToScreen(-40, -55, 109, 94, logo, 0, 0, 109);
			}
			if (tick == 1000 || keyCodeCur == KEYBD_INPUTS.KEY_ENTER && tick > 300) {
				tick == 0;
				message = "";
				message += "/n";
				message += "Press Enter to play";
				message += "";
				message += "/n";
				message += "/n";
				message += "/n";
				gamestate = GAME_STATE.MAIN_MENU;
			}
			break;

		case GAME_STATE.MAIN_MENU:

			DrawToScreen(-40, -85, 109, 94, title, 0, 0, 109);
			WriteText(0, 30, "Press Enter to play");
			WriteText(0, 42, "press Z for instructions");
			WriteText(0, 54, "     2019      ");
			WriteText(0, 60, "Pixel brownie software");

			if (keyCodeCur == KEYBD_INPUTS.KEY_ENTER && tick > 550) {

				message = "Escape the temple of chambers.";
				CreateLevel();
				gamestate = GAME_STATE.GAME;
			}
			if (keyCodeCur == KEYBD_INPUTS.KEY_Z) {

				gamestate = GAME_STATE.INSTRUCTIONS;
			}
			break;

		case GAME_STATE.INSTRUCTIONS:

			WriteText(0, 10, "Arrows > Move");
			WriteText(0, 20, "Z > Interact");
			WriteText(0, 30, "Q and W > /nswitch inventory");
			WriteText(0, 60, "X to return to main menu");
			if (keyCodeCur == KEYBD_INPUTS.KEY_X) {

				gamestate = GAME_STATE.MAIN_MENU;
			}
			break;

		case GAME_STATE.GAME:
			pl.tilex = Math.round(pl.x / tilesize);
			pl.tiley = Math.round(pl.y / tilesize);

			for (var i = 1; i < objects.length; i++) {
				var lowerboundy = pl.tiley - 3,
					lowerboundx = pl.tilex - 3,
					higherboundy = pl.tiley + 3,
					higherboundx = pl.tilex + 3;

				var obj = objects[i];

				if (obj != null) {

					obj.tilex = Math.round(obj.x / tilesize);
					obj.tiley = Math.round(obj.y / tilesize);

					if (obj.tilex < lowerboundx ||
						obj.tilex > higherboundx ||
						obj.tiley < lowerboundy ||
						obj.tiley > higherboundy)
						continue;

					canvas.fillStyle = obj.colour;
					DrawToScreen(obj.x, obj.y, tilesize, tilesize, tiles, obj.offset_x, obj.offset_y, tilesize);
				}
			}
			for (var i = 0; i < entities.length; i++) {
				var lowerboundy = pl.tiley - 3,
					lowerboundx = pl.tilex - 3,
					higherboundy = pl.tiley + 3,
					higherboundx = pl.tilex + 3;

				var obj = entities[i];

				if (obj != null) {

					obj.tilex = Math.round(obj.x / tilesize);
					obj.tiley = Math.round(obj.y / tilesize);

					if (obj.tilex < lowerboundx ||
						obj.tilex > higherboundx ||
						obj.tiley < lowerboundy ||
						obj.tiley > higherboundy)
						continue;

					canvas.fillStyle = obj.colour;
					DrawToScreen(obj.x, obj.y, tilesize, tilesize, tiles, obj.offset_x, obj.offset_y, tilesize);

				}
			}
			var obj = objects[0];
			canvas.fillStyle = obj.colour;


			if (pl_dir_x == 1)
				DrawToScreen(pl.x + pl_off_x, pl.y + pl_off_y, tilesize, tilesize, mc_image, 1, 0, tilesize);
			else if (pl_dir_x == -1)
				DrawToScreen(pl.x + pl_off_x, pl.y + pl_off_y, tilesize, tilesize, mc_image, 3, 0, tilesize);
			else if (pl_dir_y == -1)
				DrawToScreen(pl.x + pl_off_x, pl.y + pl_off_y, tilesize, tilesize, mc_image, 2, 0, tilesize);
			else if (pl_dir_y == 1)
				DrawToScreen(pl.x + pl_off_x, pl.y + pl_off_y, tilesize, tilesize, mc_image, 0, 0, tilesize);
			else if (pl_dir_x == 0 && pl_dir_y == 0)
				DrawToScreen(pl.x + pl_off_x, pl.y + pl_off_y, tilesize, tilesize, mc_image, 0, 0, tilesize);


			DrawToScreen(pl.x + ((tilesize / 2) * pl_dir_x), pl.y + ((tilesize / 2) * pl_dir_y), null);

			var item_names = [];

			for (var i = 0; i < ITEMS.length; i++) {

				//Check for any existing item names


				if (!FindStringInList(item_names, ITEMS[i].name))
					item_names.push(ITEMS[i].name);

				var num = FindNumberOfSameStrings(ITEMS, item_names[id]);

			}
			for (var id = 0; id < item_names.length; id++) {

				//WriteText(0, 0, "hhh" + 4);
				//DrawToScreen(pl.x - 11, pl.y + 4, 10, 10, font, 3, 1, 10);
			}
			var num = FindNumberOfSameStrings(ITEMS, item_names[selected_item]);
			if (selected_item > item_names.length - 1) {
				selected_item = 0;
			}
			if (selected_item < 0) {
				selected_item = item_names.length - 1;
			}
			//+ pl_dir_x + " Y: " + pl_dir_y

			WriteText(0, 0, message);
			if (item_names.length > 0) {
				WriteText(0, 0 + -10, item_names[selected_item] + " x " + num);
			}
			WriteText(0, 0 + -5, "<Q   items  W>");
			break;

		case GAME_STATE.ENDING:

			part = 0;

			if (tick > 200) {
				part++;
			}
			if (tick > 800) {
				part++;
			}
			if (tick > 2300) {
				part++;
			}

			switch (part)
			{
				case 1:
					WriteText(0, 10, "Congratulations");
					WriteText(0, 30, "You have made it out of the temple of chambers.");
					break;

				case 2:
					WriteText(0, 10, "and now, freedom is yours...");
					WriteText(0, 30, "or is it?");
					break;

				case 3:
					WriteText(0, 10, "Temple of chambers");
					WriteText(0, 30, "Created by pixel brownie software 2019");
					break;
			}

			break;



		//WriteText(0, 0 + -5, "Keycode debug: " + keyCodeCur);
		//canvas.fillText("type " + CheckObjectCollisionX(pl.x, pl.y), 0, 10 * 8, 50);
		//canvas.fillText("type " + CheckObjectCollisionX(pl.x, pl.y), 0, 10 * 8, 50);

	}
}

	function FindNumberOfSameStrings(arr, string) {
		ind = 0;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].name == string)
				ind++;
		}
		return ind;
	}

	function FindStringInList(arr, string) {
		for (var i = 0; i < arr.length; i++) {
			if (string == arr[i].name)
				return true;
		}
		return false;
	}

	function CheckObjectCollisionX(y1, x1) {

		var x = Math.trunc(x1 / tilesize);
		var y = Math.trunc(y1 / tilesize);

		for (var i = 0; i < entities.length; i++) {
			var obj = entities[i];
			if (obj.type == OBJECT_TYPE.ENTITY)
				continue;
			if (obj.tiley == y &&
				obj.tilex == x) {
				return obj;
			}
		}
		for (var i = 1; i < objects.length; i++) {
			var obj = objects[i];
			if (obj.tiley == y &&
				obj.tilex == x) {
				return obj;
			}
		}
		return null;
	}
	function CheckObjectCollisionY(x1, y1) {

		var x = Math.trunc(x1 / tilesize);
		var y = Math.trunc(y1 / tilesize);
		for (var i = 0; i < entities.length; i++) {
			var obj = entities[i];
			if (obj.type == OBJECT_TYPE.ENTITY)
				continue;
			if (obj.tilex == x &&
				obj.tiley == y) {
				return obj;
			}
		}
		for (var i = 1; i < objects.length; i++) {
			var obj = objects[i];
			if (obj.tilex == x &&
				obj.tiley == y) {
				return obj;
			}
		}
		return null;
	}
	function CheckTile(y, x) {

		for (var i = 0; i < entities.length; i++) {
			var obj = entities[i];
			if (obj.tiley == y &&
				obj.tilex == x) {
				return obj;
			}
		}
		for (var i = 1; i < objects.length; i++) {
			var obj = objects[i];
			if (obj.tiley == y &&
				obj.tilex == x) {
				return obj;
			}
		}
		return null;
	}

	function CheckCollisionExist(one, two) {
		if (one.type == OBJECT_TYPE.SOLID ||
			two.type == OBJECT_TYPE.SOLID)
			return true;
		if (one.type == OBJECT_TYPE.BREAKABLE ||
			two.type == OBJECT_TYPE.BREAKABLE)
			return true;
		if (one.type == OBJECT_TYPE.MUD ||
			two.type == OBJECT_TYPE.MUD) {
			if (!FindStringInList(ITEMS, "BOOTS")) {
				error_sound.play();
				message = "You need boots.";
				return true;
			} else {
				if (ITEMS[selected_item].name != "BOOTS") {
					error_sound.play();
					message = "Select the boots.";
					return true;
				}
			}
		}
		if (one.type == OBJECT_TYPE.DOOR ||
			two.type == OBJECT_TYPE.DOOR) {
			error_sound.play();
			message = "You need " + one.itemrequire + ".";
			return true;
		}
		if (one.type == OBJECT_TYPE.PUSHABLE ||
			two.type == OBJECT_TYPE.PUSHABLE)
			return true;
		if (one.type == OBJECT_TYPE.PUSHABLE_CRATE ||
			two.type == OBJECT_TYPE.PUSHABLE_CRATE)
			return true;
		if (one.type == OBJECT_TYPE.HOLE_BALL ||
			two.type == OBJECT_TYPE.HOLE_BALL)
			return true;

		/*
		if (one.type == OBJECT_TYPE.PUSHABLE ||
			two.type == OBJECT_TYPE.PUSHABLE) {
			if (!CheckObjectCollisionX(
				one.x + (pl_dir_x * tilesize),
				one.x + (pl_dir_y * tilesize)))
			{
				return true;
			} else {
	
				one.x += tilesize * pl_dir_x;
				one.y += tilesize * pl_dir_y;
			}
		}
		*/
		if (two.type == OBJECT_TYPE.ICY_FLOOR ||
			one.type == OBJECT_TYPE.ICY_FLOOR)
			pl_current_state = pl_states.STATIC;
		return false;
	}

	function PlayerControl() {
		switch (pl_current_state) {
			case pl_states.MOVING:

				/*
				if (keyCodeCur == KEYBD_INPUTS.KEY_RIGHT) {
					var one = CheckObjectCollisionX(pl.y + 1, pl.x + tilesize);
					var two = CheckObjectCollisionX(pl.y + tilesize - 1, pl.x + tilesize);
	
					var pick = CheckObjectCollisionX(pl.y + tilesize / 2, pl.x + tilesize);
	
					if (pick) {
						PlayerDetectObjectFront(pick);
					}
	
					pl_dir_x = 1;
					pl_dir_y = 0;
	
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.x += 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_LEFT) {
					var one = CheckObjectCollisionX(pl.y + 1, pl.x - 1);
					var two = CheckObjectCollisionX(pl.y + tilesize - 1, pl.x - 1);
					var pick = CheckObjectCollisionX(pl.y + tilesize / 2, pl.x - 1);
	
					if (pick) {
						PlayerDetectObjectFront(pick);
					}
					pl_dir_x = -1;
					pl_dir_y = 0;
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.x -= 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_DOWN) {
					var one = CheckObjectCollisionY(pl.x, pl.y + tilesize);
					var two = CheckObjectCollisionY(pl.x + tilesize - 1, pl.y + tilesize);
	
					var pick = CheckObjectCollisionY(pl.x + tilesize / 2, pl.y + tilesize);
	
					if (pick) {
						PlayerDetectObjectFront(pick);
					}
					pl_dir_x = 0;
					pl_dir_y = 1;
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.y += 20;
				}
				if (keyCodeCur == KEYBD_INPUTS.KEY_UP) {
					var one = CheckObjectCollisionY(pl.x, pl.y - 1);
					var two = CheckObjectCollisionY(pl.x + tilesize - 1, pl.y - 1);
	
					var pick = CheckObjectCollisionY(pl.x + tilesize / 2, pl.y - 1);
	
					if (pick) {
						PlayerDetectObjectFront(pick);
					}
					pl_dir_y = -1;
					pl_dir_x = 0;
					if (one && two) {
						PlayerDetectObject(one, two);
						if (CheckCollisionExist(one, two))
							break;
					}
					pl.y -= 20;
				}
				*/

				//if (CheckCompleteObjectCollision(pl.x, pl.y) == OBJECT_TYPE.ICY_FLOOR)

				break;

			case pl_states.STATIC:
				var coll;
				if (pl_dir_x == 1) {

					coll = CheckTile(pl.tilex + 1, pl.tiley);

					if (coll) {
						console.log(coll.type);
						if (coll.type != OBJECT_TYPE.ICY_FLOOR)
							pl_current_state = pl_states.MOVING;
					}
				}
				if (pl_dir_x == -1) {
					coll = CheckTile(pl.tilex - 1, pl.tiley);

					if (coll) {
						if (coll.type != OBJECT_TYPE.ICY_FLOOR)
							pl_current_state = pl_states.MOVING;
					}
				}
				if (pl_dir_y == -1) {
					coll = CheckTile(pl.tilex, pl.tiley - 1);

					if (coll) {
						console.log(coll.type);
						if (coll.type != OBJECT_TYPE.ICY_FLOOR)
							pl_current_state = pl_states.MOVING;
					}
				}
				if (pl_dir_y == 1) {
					coll = CheckTile(pl.tilex, pl.tiley + 1);

					if (coll) {
						console.log(coll.type);
						if (coll.type != OBJECT_TYPE.ICY_FLOOR)
							pl_current_state = pl_states.MOVING;
					}
				}
				pl.tilex += pl_dir_x;
				pl.tiley += pl_dir_y;

				pl.y = pl.tiley * tilesize;
				pl.x = pl.tilex * tilesize;
				break;
		}
	}
	function CheckCompleteObjectCollision(x, y) {

		var x1 = Math.trunc(x / tilesize);
		var y1 = Math.trunc(y / tilesize);

		for (var i = 0; i < entities.length; i++) {
			var obj = entities[i];
			if (obj.tiley == y1 &&
				obj.tilex == x1) {
				return obj;
			}
		}
		for (var i = 1; i < objects.length; i++) {
			var obj = objects[i];
			if (obj.tiley == y1 &&
				obj.tilex == x1) {
				return obj;
			}
		}
	}

	function PlayerDetectObject(one, two) {
		if (one != null) {
			if (one.type == OBJECT_TYPE.ITEM ||
				one.type == OBJECT_TYPE.FLOOR ||
				one.type == OBJECT_TYPE.GOAL ||
				(FindStringInList(ITEMS, two.itemrequire) && one.type == OBJECT_TYPE.DOOR)) {

				CheckObject(one);
				return;
			}
			//else if (one.type == OBJECT_TYPE.ICY_FLOOR)
			//pl_current_state = pl_states.STATIC;
		}
		if (two != null) {
			if (two.type == OBJECT_TYPE.ITEM ||
				two.type == OBJECT_TYPE.FLOOR ||
				one.type == OBJECT_TYPE.GOAL ||
				(FindStringInList(ITEMS, two.itemrequire) && two.type == OBJECT_TYPE.DOOR)) {
				CheckObject(two);
				return;
			}
			//else if (one.type == OBJECT_TYPE.ICY_FLOOR)
			//pl_current_state = pl_states.STATIC;
		}
	}
	function PlayerDetectObjectFront(front) {
		if (front != null) {
			if (front.type == OBJECT_TYPE.BREAKABLE)
				CheckObject(front);
			if (front.type == OBJECT_TYPE.PUSHABLE)
				CheckObject(front);
			if (front.type == OBJECT_TYPE.PUSHABLE_CRATE)
				CheckObject(front);
			//else if (one.type == OBJECT_TYPE.ICY_FLOOR)
			//pl_current_state = pl_states.STATIC;
		}
	}


function Update() {
		tick++;
		WriteText(0, 0 + 10, "Ticks: " + tick);

		switch (gamestate) {

			case GAME_STATE.GAME:

				PollKeyEvents();
				//console.log("x: " + offsetCanvasX + " y: " + offsetCanvasY + " Size: " + size);
				PlayerControl();

				if (message_steps == max_message_steps) {
					message = "";
					message_steps = 0;
				}
				break;
	}
	Draw();
	canvas.imageSmoothingEnabled = false;
		//DrawToScreen(pl.x + 3, pl.y +2, 7, 7, null);
		//DrawToScreen(pl.x + (tilesize * pl_dir_x),  pl.y + ((tilesize / 2) * pl_dir_y), 1, 1, null);

	}
