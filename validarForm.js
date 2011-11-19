/*
 * @author Luis Carlos Boch luis.c.boch@gmail.com
 * @since 
 * */

(function($) {
    $.fn.validarForm = function(settings) {
  settings = $.extend({
            useAlert: false,
            htmlError:'<div class="validar-form-msg-erro" style="position:absolute; color:#666666; padding:7px; font-size:11px; margin:-5px 0px 0px 0px;width:200px; background: #FDD; z-index:99999; border:1px dotted #999;display:none;">${mesage}</div>',
            attrRequired:'require',
            attrMesage:'mesage',
            attrType:'validate',
            attrTest:'test'
        }, settings);
        var attrMsg = settings.attrMesage, attrTp = settings.attrType, attrRq = settings.attrRequired, attrTst = settings.attrTest;
        var msg = '';
        var last_mesage;
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
	/*
	 * @author Luis Carlos Boch <luis.c.boch@gmail.com>
	 * @param msg String mensagem que será exibida no campo, obrigatório
	 * @param l objeto jQuery que será aplicado a mensagem de erro
	 * @param status opcional caso true remove a mensagem não mais exibindo a mesma, usado preferencialmente no interior do objeto
	 */
	function displayError(msg,l,status)
	{
		if(settings.useAlert){
			alert(msg)
		}
		else{
			html = settings.htmlError.replace("${mesage}",msg)
			
			if(last_mesage){last_mesage.remove()}
			
			l.after(html)
			
			last_mesage = l.next()
			
			l.next().css({
				'left':(l.offset().left+l.width()-5)+'px',
				'top':(l.offset().top+15)+'px',
				'display':'none'
			})
			
			l.next().fadeIn(500)
			
			l.unbind('change')
			l.change(function(){
				if(l.next().attr('class')=='validar-form-msg-erro'){
					
					last_mesage.animate({
    						opacity: 0
					 	}, 500, function() {
					    last_mesage.remove();
					  });
				}	
			})
			l.unbind('keyup')
			l.keyup(function(){
				if(l.next().attr('class')=='validar-form-msg-erro'){
					last_mesage.animate({
    						opacity: 0
					 	}, 500, function() {
					    last_mesage.remove();
					  });
				
				}
			})
				
			
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
				case 'cpf':
					if(!validarCpf(itm.val())){
						if(!msg){msg = "Este campo deve ser cpf válido!"}
						return false;
					}
				break;
				case 'email':
					reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})+$/;
					if(!reEmail.test(itm.val())){
						if(!msg){msg = "Este campo deve ser um email válido!"}
						return false;
					}
				break;
				case 'cep':
					reCEP = /^\d{5}-\d{3}$/;
					if(!reCEP.test(itm.val())){
						if(!msg){msg = "Este campo deve ser um CEP válido!"}
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
        /*
         * @author http://www.gerardocumentos.com.br/?pg=funcao-javascript-para-validar-cpf
         * @param cpf Cpf a ser validado!
         * @return boolean indicando se é válido ou não.
         * 
         */
        function validarCpf(cpf){
              var numeros, digitos, soma, i, resultado, digitos_iguais;
              digitos_iguais = 1;
              if (cpf.length < 11)
                    return false;
              for (i = 0; i < cpf.length - 1; i++)
                    if (cpf.charAt(i) != cpf.charAt(i + 1))
                          {
                          digitos_iguais = 0;
                          break;
                          }
              if (!digitos_iguais)
                    {
                    numeros = cpf.substring(0,9);
                    digitos = cpf.substring(9);
                    soma = 0;
                    for (i = 10; i > 1; i--)
                          soma += numeros.charAt(10 - i) * i;
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(0))
                          return false;
                    numeros = cpf.substring(0,10);
                    soma = 0;
                    for (i = 11; i > 1; i--)
                          soma += numeros.charAt(11 - i) * i;
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(1))
                          return false;
                    return true;
                    }
              else
                    return false;
        }
}
})(jQuery);

