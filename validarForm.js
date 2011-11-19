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
            attrTest:'test',
            homologacao:false
        }, settings);
        var attrMsg = settings.attrMesage, attrTp = settings.attrType, attrRq = settings.attrRequired, attrTst = settings.attrTest;
        var msg = '';
        var last_mesage;
        var h = settings.homologacao;
        var f//objeto formulario;
        var itms_atingidos;
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
								valido = validar($(this),tipo,f)
							}
							
							if(!valido){
								this.focus()
								$(this).css('background','#fFD');
								displayError(msg,$(this));
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
			
			if(h&&valido){//homologacao
				$('body').append('<p>Formulário Válidado!</p>')
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
			
			
			itms_atingidos.unbind('change')
			itms_atingidos.change(function(){
					
				last_mesage.animate({
						opacity: 0
				 	}, 500, function() {
				    last_mesage.remove();
				  });
			})
			itms_atingidos.unbind('keyup')
			
			itms_atingidos.unbind('click')
			itms_atingidos.click(function(){
				last_mesage.animate({
						opacity: 0
				 	}, 500, function() {
				    last_mesage.remove();
				  });
			})
			itms_atingidos.unbind('keyup')
			
			itms_atingidos.keyup(function(){
				last_mesage.animate({
						opacity: 0
				 	}, 500, function() {
				    last_mesage.remove();
				  });
			
			})
				
			
		}
	}
	function validar(itm,tp,form)
	{
		
		tag_search = itm.get(0).tagName.toLowerCase();
		itm_name = itm.attr("name")
		
		if(tp){
			switch(tipo){
				case 'float':
					reDigits = /^[+-]?((\d+|\d{1,3}(\.\d{3})+)(\,\d*)?|\,\d+)$/;
					if(itm.val()==''||!reDigits.test(itm.val())){
						if(!msg){msg = "Este campo deve ser numero!"}
						itms_atingidos  = itm;
						return false;
					}
				break;
				case 'integer':
					reDigits = /^\d+$/;
					if(itm.val()==''||!reDigits.test(itm.val())){
						if(!msg){msg = "Este campo deve ser numero inteiro!"}
						itms_atingidos  = itm;
						return false;
					}
				break;
				case 'cpf':
					if(!validarCpf(itm.val().replace('.','').replace('.','').replace('.','').replace('-',''))){
						if(!msg){msg = "Este campo deve ser cpf válido!"}
						itms_atingidos  = itm;
						return false;
					}
				break;
				case 'cnpj':
					if(!validaCnpj(itm.val().replace('.','').replace('.','').replace('/','').replace('-',''))){
						if(!msg){msg = "Este campo deve ser CNPJ válido!"}
						itms_atingidos  = itm;
						return false;
					}
				break;
				case 'email':
					reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})+$/;
					if(!reEmail.test(itm.val())){
						
						if(!msg){msg = "Este campo deve ser um email válido!"}
						itms_atingidos  = itm;
						return false;
					}
				break;
				case 'cep':
					reCEP = /^\d{8}$/;
					if(!reCEP.test(itm.val().replace('-',''))){
						itms_atingidos  = itm;
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
							itms_atingidos  = itm;
							return false;
						}else if(parseInt(itm.val().length) != num){
							if(!msg){msg = "Este campo deve ser numero com "+num+"!"}
							itms_atingidos  = itm;
							return false;
						}
					}
					else if(tipo.indexOf('count')!=1)
					{
					
						//t = varivel que armazena o tipo de dado
						aux = Array();
						aux[0] = tipo.indexOf('[')+1;
						aux[1] = tipo.indexOf(']');
						aux[1] = aux[1]-aux[0];
						a = tipo.substr(aux[0],aux[1])
						t = a.split(',');
						t[1]= parseInt(t[1]);
						
						
						if(itm_name != undefined){ itm_name = itm_name.replace('[]','').replace('[]','') }
						itms_atingidos =$(form).find(tag_search+'[name^='+itm_name+']');
						
						if(t[2]==undefined && itms_atingidos.filter(':'+t[0]).length<t[1])
						{
							if(!msg){msg = "Selecione pelo menos "+t[1]+" opçõe(s)!"}
							return false;
						}
						else if(t[2]== '=' && itms_atingidos.filter(':'+t[0]).length!=t[1]){
							
							if(!msg){msg = "Selecione apenas "+t[1]+" opçõe(s)!"}
							return false;
							
						}
						else if(t[2]== '<' && itms_atingidos.filter(':'+t[0]).length>=t[1]){
							
							if(!msg){msg = "Selecione no máximo "+(t[1]-1)+" opçõe(s)!"}
							return false;
							
						}
						else if(t[2]== '>' && itms_atingidos.filter(':'+t[0]).length<=t[1]){
							
							if(!msg){msg = "Selecione mais que "+t[1]+" opçõe(s)!"}
							return false;
							
						}
					}
					else if(itm.val()==''){
						
						itms_atingidos  = itm;
						if(!msg){msg = "Este campo não deve ficar vazio!"}
						return false;
					}
				break;
			}
		}
		else if(tag_search == 'input' && itm.attr('type') == 'radio'){
			itms_atingidos =$(form).find(tag_search+'[name^='+itm_name+']');
				
			if(itms_atingidos.filter(':checked').length == 0 || itms_atingidos.filter(':checked').val() == ''){
				if(!msg){msg = "Selecione uma opcão válida!"}
				return false;
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
    
	function validaCnpj(cnpj)
	{
		var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
		digitos_iguais = 1;
		if (cnpj.length < 14 && cnpj.length < 15)
			return false;
		for (i = 0; i < cnpj.length - 1; i++)
			if (cnpj.charAt(i) != cnpj.charAt(i + 1))
			{
				digitos_iguais = 0;
				break;
			}
      	if (!digitos_iguais)
    	{
			tamanho = cnpj.length - 2
			numeros = cnpj.substring(0,tamanho);
			digitos = cnpj.substring(tamanho);
			soma = 0;
			pos = tamanho - 7;
			for (i = tamanho; i >= 1; i--)
			{
				soma += numeros.charAt(tamanho - i) * pos--;
				if (pos < 2)
					pos = 9;
			}
			resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
			if (resultado != digitos.charAt(0))
				return false;
			tamanho = tamanho + 1;
			numeros = cnpj.substring(0,tamanho);
			soma = 0;
			pos = tamanho - 7;
			for (i = tamanho; i >= 1; i--)
			{
				soma += numeros.charAt(tamanho - i) * pos--;
				if (pos < 2)
					pos = 9;
			}
			resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
			if (resultado != digitos.charAt(1))
				return false;
			return true;
		}
		else
			false;
	} 
}
})(jQuery);

