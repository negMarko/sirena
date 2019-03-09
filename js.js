
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

			// this function is to initialise audio on iOS devices
			window.addEventListener('touchend', function()
			{
				// create an empty buffer
				var buffer = audioCtx.createBuffer(1, 1, 22050);
				var source = audioCtx.createBufferSource();
				source.buffer = buffer;

				// connect to output
				source.connect(audioCtx.destination);

				// play the empty buffer
				source.start();
			}, false);
			
			// create audio nodes
			var oscillatorA = audioCtx.createOscillator();
			var oscillatorB = audioCtx.createOscillator();
			
			var gainNodeA = audioCtx.createGain();
			var gainNodeB = audioCtx.createGain();
			var gainNodeC = audioCtx.createGain();
			var gainNodeD = audioCtx.createGain();

			var feedback = audioCtx.createGain();
			var biquadFilter = audioCtx.createBiquadFilter();
			var delay = audioCtx.createDelay(1.0);

			// set parameters
			oscillatorA.type = 'square';
			oscillatorB.type = 'square';
			oscillatorA.frequency.value = 800;
			oscillatorB.frequency.value = 3.5;
				
			gainNodeA.gain.value = 400;
			gainNodeB.gain.value = 0;
			gainNodeC.gain.value = 0.5;
			gainNodeD.gain.value = 0.5;


			feedback.gain.value = 0.5;
			delay.delayTime.value = 0.5;
			biquadFilter.type = "highpass";
			biquadFilter.frequency.value = 800;
			biquadFilter.Q.value = 5;

			// connect nodes
			oscillatorB.connect(gainNodeA);
			gainNodeA.connect(oscillatorA.frequency);
			oscillatorA.connect(gainNodeB);
			gainNodeB.connect(biquadFilter);
			biquadFilter.connect(delay);
			delay.connect(feedback);
			feedback.connect(biquadFilter);
			delay.connect(gainNodeC);
			gainNodeB.connect(gainNodeC);
			gainNodeC.connect(gainNodeD);
			gainNodeD.connect(audioCtx.destination);

			// start oscillators
			oscillatorA.start();
			oscillatorB.start();
			
			// GUI control
			window.onload=function()
			{
				var trig = document.getElementById("trigger");
				trig.addEventListener("touchstart", mousedown, false);
				trig.addEventListener("touchend", mouseup, false);
				trig.addEventListener("mousedown", mousedown, false);
				trig.addEventListener("mouseup", mouseup, false);
			}

			function mouseup(event)
			{    
				event.preventDefault();
				document.getElementById("trigger").style.backgroundColor = "rgba(200,200,200,1)";				
				gainNodeB.gain.value = 0;
			}
			
			function mousedown(event)
			{    
				event.preventDefault();
				document.getElementById("trigger").style.backgroundColor = "rgba(255,50,50,1)";
				gainNodeB.gain.value = 1;
			}
			
			// keyboard control
			window.addEventListener("keydown", keydown, false);
			window.addEventListener("keyup", keyup, false);

			function keydown(e)
			{
				if (e.keyCode == "32")
				{
					document.getElementById("trigger").style.backgroundColor = "rgba(255,50,50,1)";
					gainNodeB.gain.value = 1;
				}
			}
			
			function keyup(e)
			{
				if (e.keyCode == "32")
				{
					document.getElementById("trigger").style.backgroundColor = "rgba(200,200,200,1)";				
					gainNodeB.gain.value = 0;
				}
			}
		
			// range slider functions
			function changeVolume(newValue)
			{
				gainNodeD.gain.value = newValue;
			}

			function changePitch(newValue)
			{
				gainNodeA.gain.value = Math.pow(newValue,1.5) * 900. + 100.;
				oscillatorA.frequency.value = Math.pow(newValue,1.5) * 1800. + 200.;
			}

			function changeRate(newValue)
			{
				oscillatorB.frequency.value = Math.pow(newValue,1.5) * 10.;
			}
			
			function changeTime(newValue)
			{
				delay.delayTime.value = newValue;
			}
			
			function changeCutoff(newValue)
			{
				biquadFilter.frequency.value = Math.pow(newValue,1.5) * 1900. + 100.;
			}
			
			// mode button
			function mode()
			{
			  document.getElementById("toggle").blur();
			
			  if(document.getElementById("toggle").value=="TRIANGLE")
			  {
			  	document.getElementById("toggle").value="SQUARE";
			  	oscillatorB.type = 'square';
			  }
			  else if(document.getElementById("toggle").value=="SQUARE")
			  {
			    document.getElementById("toggle").value="TRIANGLE";
			    oscillatorB.type = 'triangle';
			  }
			}