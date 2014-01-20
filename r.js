function rotu(u, v, a)
{
	return u * Math.cos(a) - v * Math.sin(a);
}

function rotv(u, v, a)
{
	return u * Math.sin(a) + v * Math.cos(a);
}

function rotxy(x, y, z, ex, ey, ez, ax, ay)
{
	var ry = rotu(ey, ez, ax);
	var rz = rotv(ey, ez, ax);
	var rx = rotu(ex, rz, ay);
	var rz = rotv(ex, rz, ay);
	return x * rx + y * ry + z * rz;
}

function projxy(x, y, z, ex, ey, ax, ay, m)
{
	var xx = (m == 2 ? z : x);
	var yy = (m == 0 ? z : y);
	var zz = (m == 0 ? -y : (m == 2 ? x : z));
	return rotxy(xx, yy, zz, ex, ey, 0, ax, ay) / (1.0 - 0.3 * rotxy(xx, yy, zz, 0, 0, -1, ax, ay));
}

function outcoordx(x, m)
{
	return (m > 0 ? (x * 0.58 + 0.52) : (x * -0.58 + 0.48));
}

function outcoordy(y, m)
{
	return (m > 0 ? (y * 0.58 + 0.46) : (y * -0.58 + 0.54));
}

function tile(ctx, r, x0, y0, x1, y1, x2, y2, x3, y3, z, ax, ay, c, m, mx, my, stroke)
{
	var xx0 = outcoordx(projxy(x0, y0, z, 1, 0, ax, ay, m), mx) * r;
	var yy0 = outcoordy(projxy(x0, y0, z, 0, 1, ax, ay, m), my) * r;
	var xx1 = outcoordx(projxy(x1, y1, z, 1, 0, ax, ay, m), mx) * r;
	var yy1 = outcoordy(projxy(x1, y1, z, 0, 1, ax, ay, m), my) * r;
	var xx2 = outcoordx(projxy(x2, y2, z, 1, 0, ax, ay, m), mx) * r;
	var yy2 = outcoordy(projxy(x2, y2, z, 0, 1, ax, ay, m), my) * r;
	var xx3 = outcoordx(projxy(x3, y3, z, 1, 0, ax, ay, m), mx) * r;
	var yy3 = outcoordy(projxy(x3, y3, z, 0, 1, ax, ay, m), my) * r;
	
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.strokeStyle = c;
	ctx.moveTo(xx0, yy0);
	ctx.lineTo(xx1, yy1);
	ctx.lineTo(xx2, yy2);
	ctx.lineTo(xx3, yy3);
	ctx.fill();
	if (stroke)
		ctx.stroke();
}

function square(ctx, r, x, y, w, b, z, m, c, mx, my, stroke)
{
	tile(ctx, r,
		x + b - 0.5, y + b - 0.5, x + w - b - 0.5, y + b - 0.5,
		x + w - b - 0.5, y + w - b - 0.5, x + b - 0.5, y + w - b - 0.5, z,
		-0.5, 0.6, c, m, mx, my, stroke);
}

var insertid = 0;

function r(fl, m, size, b, d)
{
	var side = Math.sqrt(fl.length / 3);
	if (typeof size == "undefined" || size < 0)
		var size = 150;
	if (typeof b == "undefined" || b < 0)
		var b = 25;
	if (typeof d == "undefined" || d < 0)
		var d = 5;
	var c = {
		"r":"#D00000",
		"o":"#EE8800",
		"b":"#2040D0",
		"g":"#11AA00",
		"w":"#FFFFFF",
		"y":"#FFFF00",
		"l":"#DDDDDD",
		"d":"#555555",
		"x":"#999999",
		"k":"#111111",
		"c":"#0099FF",
		"p":"#FF99CC",
		"m":"#FF0099"
		};
	
	if (!m)
	{
		var mx = 1;
		var my = 1;
	}
	else if (m == "x")
	{
		var mx = -1;
		var my = 1;
	}
	else if (m == "y")
	{
		var mx = 1;
		var my = -1;
	}
	else if (m == "xy")
	{
		var mx = -1;
		var my = -1;
	}
	else
	{
		var mx = 1;
		var my = 1;
	}

	//var canvas = document.createElement("canvas");
	document.write("<canvas id=\"insert" + insertid + "\"></canvas>");
	var canvas = document.getElementById("insert" + insertid);
	insertid++;
	if (canvas.getContext)
	{
		canvas.className = "cube";
		canvas.width = size;
		canvas.height = size;
		var ctx = canvas.getContext("2d");
		
		square(ctx, size, 0, 0, 1, 0, -0.5, 0, "#010101", mx, my, true); // U
		square(ctx, size, 0, 0, 1, 0, -0.5, 1, "#090909", mx, my, true); // F
		square(ctx, size, 0, 0, 1, 0,  0.5, 2, "#050505", mx, my, true); // R
		
		for (m = 0; m < 3; m++)
			for (i = 0; i < side; i++)
				for (j = 0; j < side; j++)
					square(ctx, size,
						   j / (1.0 * side), i / (1.0 * side), 1.0 / side, b / 1000.0,
						   (m < 2 ? (-0.5 - d / 1000.0) : (0.5 + d / 1000.0)),
						   m, c[fl.substr(m * side * side + i * side + j, 1)], mx, my, false);
		
		//document.body.appendChild(canvas);
	}
}

function m(mv)
{
	//var list = document.createElement("ul");
	document.write("<ul id=\"insert" + insertid + "\"></ul>");
	var list = document.getElementById("insert" + insertid);
	insertid++;
	
	list.className = "algorithm";
	
	mv = mv.replace(/\s/g, "");
	
	for (i = 0; i < mv.length; i++)
	{
		var li = document.createElement("li");
		
		var slice, dir = "";
		
		slice = mv[i];
		
		if (i + 1 < mv.length)
		{
			if (mv[i + 1] == "2")
			{
				dir = "2";
				i++;
			}
			else if (mv[i + 1] == "'")
			{
				dir = "'";
				i++;
			}
		}
		
		//li.innerHTML = slice + dir + "<br>";
		
		if (dir == "" || dir == "'")
		{
			var img = document.createElement("img");
			img.src = "move/" + slice + dir + ".png";
			li.appendChild(img);
		}
		else if (dir == "2")
		{
			for (n = 0; n < 2; n++)
			{
				var img = document.createElement("img");
				img.src = "move/" + slice + ".png";
				li.appendChild(img);
			}
		}
		
		var p = document.createElement("p");
		p.innerHTML = slice + dir;
		li.appendChild(p);
		
		list.appendChild(li)
	}
	
	//document.body.appendChild(list);
}