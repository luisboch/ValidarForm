(function($) {
    $.fn.ValidarForm = function(settings) {
  settings = $.extend({
            useAlert: false,
			htmlError:'<div class="validar-form-msg-erro" style="position:absolute; color:#666666; padding:7px; font-size:11px; margin:-5px 0px 0px 0px;width:200px; background: #FDD; z-index:99999; border:1px dotted #999;display:none;"></div>',
			attrRequired:'require',
			attrMesage:'mesage',
			attrType:'validate',
			attrTest:'test'
        }, settings);
        var attrMsg = settings.attrMesage, attrTp = settings.attrType, attrRq = settings.attrRequired, attrTst = settings.attrTest;
        var msg = '';
	$(this).each(function(){
		f = this
		$(f).submit(function(){
			try{
				valido = true;
				$(f).unbind('click')
				$(f).click(function(){
					$(f).find('['+attrTp+']').css('background','#FFF');
					$(f).find('['+attrRq+']').css('background','#FFF');
				})
				$(f).find('[validar]').each(function(){
					if(!$(this).attr(attrRq) && $(this).val()!='')
					{
						$(this).attr(attrRq,'aux')
					}
				})
				$(f).find('['+attrRq+']').each(function(i){
					if(valido){
						tipo = $(this).attr(attrTp);
						msg = $(this).attr(attrMsg);
						require =  $(this).attr(attrRq);
						dependencia = $(this).attr(attrTst)
						teste = true;
						if(dependencia)
						{
							tp = '';
							if(dependencia.indexOf('=')!=-1){
								tp = 'igual';
								campos = dependencia.split('=');
							}
							else if(dependencia.indexOf('!=')!=-1)
							{
								tp = 'diferente'
								campos = dependencia.split('!=');
							}
							else if(dependencia.indexOf('>')!=-1)
							{
								tp = 'maior'
								campos = dependencia.split('>');
							}
							else if(dependencia.indexOf('<')!=-1)
							{
								tp = 'menor'
								campos = dependencia.split('<');
							}
							
							campo_a = $('#'+campos[0])
							campo_b = campos[1]
							
							if(campo_a.length==0){
								campo_a = $('[name='+campos[0]+']')
							}
							
							if(campo_a.length ==0)
							{
								throw new Exeption("O campo definido para teste deve ser definido com o name ou id do item");
							}
							
							switch(tp){
								case 'maior':
								{
									if( campo_a.val() <= campo_b )
									{
										teste = false;
									}
								}
								break;
								case 'menor':
								{
									if( campo_a.val() >= campo_b )
									{
										teste = false;
									}
								}
								break;
								case 'diferente':
								{
									if( campo_a.val() == campo_b )
									{
										teste = false;
									}
								}
								break;
								case 'igual':
								{
									if( campo_a.val() != campo_b )
									{
										teste = false;
									}
								}
								break;
							}
						}
						if(teste){
							if($(this).val()!=''){ require = true }
							
							if(require){
								valido = validar($(this),tipo)
							}
							
							if(!valido){
								displayError(msg,$(this));
								this.focus()
								$(this).css('background','#fFD');
							}
							else{
								$(this).css('background','#FFF');
							}
						}
						else
						{
							n = $(this).css('background','#FFF').next();
							if(n.attr('class')=='erro_form'){
								n.fadeOut(200)
							}
						}
					}
				})
				
				$(f).find('['+attrRq+'=aux]').each(function(){
				$(this).removeAttr(attrRq)
				
				})
			
			}catch(e){
				return false;
			}
			return valido;
		})
	});
	function displayError(msg,l,status)
	{
		if(settings.useAlert){
			alert(msg)
		}
		else{
			if(!status){
				if(l.next().find('div.validar-form-msg-erro').length==0||l.next().attr('class')!='validar-form-msg-erro'){
					l.after(settings.htmlError)
				}
				if(l.next().find('div.validar-form-msg-erro').length==1){
					l.next().find('div.validar-form-msg-erro').html(msg)
					l.next().css({
						'left':(l.offset().left+l.width()-5)+'px',
						'top':(l.offset().top+15)+'px'
					})
				}
				else if(l.next().attr('class')=='validar-form-msg-erro'){
					l.next().html(msg).css({
						'left':(l.offset().left+l.width()-5)+'px',
						'top':(l.offset().top+15)+'px'
					})
				}
		/*left:'+(l.offset().left+l.width()-5)+'px;top:'+(l.offset().top+15)+'px;*/
				l.next().fadeIn(200)
				tag = l.attr("tagName");
				l.unbind('change')
				l.change(function(){
					displayError(msg,l,true)
				})
				l.unbind('keyup')
				l.keyup(function(){
					displayError(msg,l,true)
				})
			}
			else{
				if(l.next().find('div.validar-form-msg-erro').length!=0||l.next().attr('class')=='validar-form-msg-erro'){
					l.next().fadeOut(200);
				}
			}
		}
	}
	function validar(itm,tp)
	{
		if(tipo){
			switch(tipo){
				case 'float':
					reDigits = /^[+-]?((\d+|\d{1,3}(\.\d{3})+)(\,\d*)?|\,\d+)$/;
					if(itm.val()==''||!reDigits.test(itm.val())){
						if(!msg){msg = "Este campo deve ser numero!"}
						return false;
					}
				break;
				case 'integer':
					reDigits = /^\d+$/;
					if(itm.val()==''||!reDigits.test(itm.val())){
						if(!msg){msg = "Este campo deve ser numero inteiro!"}
						return false;
					}
				break;
				default:
					if(tipo.indexOf('integer')!=-1){//inteiro com tamanho definido
						num = parseInt(tipo.substr(8,9));
						reDigits = /^\d+$/;
						if(!reDigits.test(itm.val())){
							if(!msg){msg = "Este campo deve ser numero com "+num +"!"}
							return false;
						}else if(parseInt(itm.val().length) != num){
							if(!msg){msg = "Este campo deve ser numero com "+num+"!"}
							return false;
						}
					}
					else if(itm.val()==''){
						if(!msg){msg = "Este campo não deve ficar vazio!"}
						return false;
					}
				break;
			}
		}
		else if(itm.val()==''){
			if(!msg){msg = "Este campo não deve ficar vazio!"}
				return false;
		}
			return true;
	}
}
})(jQuery);

