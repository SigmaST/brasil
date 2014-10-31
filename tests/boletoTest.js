var boleto = require('../brasil').boleto,
	Endereco = boleto.Endereco,
	Boleto = boleto.Boleto,
	Datas = boleto.Datas;

module.exports = {
	Pagador: {

	},

	Beneficiario: {

	},

	Datas: {
		'É possível instanciar um objeto de datas': function(test) {
			var datas = Datas.novasDatas();

			test.ok(datas);
			test.done();
		},

		'Deve lançar exceção se as datas forem muito antigas': function(test) {
			test.throws(function() {
				Datas.novasDatas()
						.comDocumento(1, 1, 1996)
						.comVencimento(1, 1, 1996)
						.comProcessamento(1, 1, 1996);
			});

			test.done();
		},

		'Deve lançar exceção se as datas estiverem além de 2024': function(test) {
			test.throws(function() {
				Datas.novasDatas()
						.comDocumento(1, 1, 2024)
						.comVencimento(1, 1, 2024)
						.comProcessamento(1, 1, 2024);
			});

			test.done();
		}
	},

	Endereco: {
		'Deve imprimir endereco completo': function(test) {
			var endereco = Endereco.novoEndereco()
										.comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
										.comBairro('PARQTEC ALFA')
										.comCep('88030-000')
										.comCidade('FLORIANÓPOLIS')
										.comUf('SC');

			test.equals(endereco.getEnderecoCompleto(), [
				'RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ',
				'PARQTEC ALFA 88030-000 FLORIANÓPOLIS SC'
			].join(''));

			test.done();
		},

		'Deve imprimir endereco sem logradouro': function(test) {
			var endereco = Endereco.novoEndereco()
										.comBairro('PARQTEC ALFA')
										.comCep('88030-000')
										.comCidade('FLORIANÓPOLIS')
										.comUf('SC');

			test.equals(endereco.getEnderecoCompleto(), 'PARQTEC ALFA 88030-000 FLORIANÓPOLIS SC');

			test.done();
		},

		'Deve imprimir endereco sem cep': function(test) {
			var endereco = Endereco.novoEndereco()
										.comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
										.comBairro('PARQTEC ALFA')
										.comCidade('FLORIANÓPOLIS')
										.comUf('SC');

			test.equals(endereco.getEnderecoCompleto(), [
				'RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ',
				'PARQTEC ALFA FLORIANÓPOLIS SC'
			].join(''));

			test.done();
		},

		'Deve imprimir vazio se endereço não preenchido': function(test) {
			var endereco = Endereco.novoEndereco();

			test.equals(endereco.getEnderecoCompleto(), '');
			test.done();
		},
	},

    Boleto: {
        'É possível instanciar um novo boleto': function(test) {
        	var boleto = Boleto.novoBoleto();

        	test.ok(boleto);
            test.done();
        },

        'Novo boleto deve ter alguns valores padrão': function(test) {
        	var boleto = Boleto.novoBoleto();

        	test.equals(boleto.getEspecieMoeda(), 'R$');
        	test.equals(boleto.getCodigoEspecieMoeda(), 9);
        	test.equals(boleto.getAceite(), false);
        	test.equals(boleto.getEspecieDocumento(), 'DV');

        	test.done();
        },

        'Calcula corretamente o fator de vencimento, ignorando as horas - 1': function(test) {
        	var dataDeVencimento = new Date(2008, 5 - 1, 2, 0, 0, 0, 0),
        		datas = Datas.novasDatas().comVencimento(dataDeVencimento),
        		boleto = Boleto.novoBoleto().comDatas(datas);

        	test.equals(boleto.getFatorVencimento(), '3860');
        	test.done();
        },

        'Calcula corretamente o fator de vencimento, ignorando as horas - 2': function(test) {
        	var dataDeVencimento = new Date(2008, 5 - 1, 2, 23, 59, 59, 999),
        		datas = Datas.novasDatas().comVencimento(dataDeVencimento),
        		boleto = Boleto.novoBoleto().comDatas(datas);

        	test.equals(boleto.getFatorVencimento(), '3860');
        	test.done();
        },

        'Lança exceção ao tentar definir um valor negativo para o boleto': function(test) {
        	test.throws(function() {
        		Boleto.novoBoleto().comValorBoleto(-5);
        	});

        	test.done();
        },

        'O valor formatado deve ter 10 digitos - 1': function(test) {
        	var boleto = Boleto.novoBoleto().comValorBoleto(3),
        		valorFormatado = boleto.getValorFormatado();

        	test.equals(10, valorFormatado.length);
        	test.equals('0000000300', valorFormatado);
        	test.done();
        },

        'O valor formatado deve ter 10 digitos - 2': function(test) {
        	var boleto = Boleto.novoBoleto().comValorBoleto(3.1),
        		valorFormatado = boleto.getValorFormatado();

        	test.equals(10, valorFormatado.length);
        	test.equals('0000000310', valorFormatado);
        	test.done();
        },

        'O valor formatado deve ter 10 digitos - 3': function(test) {
        	var boleto = Boleto.novoBoleto().comValorBoleto(3.18),
        		valorFormatado = boleto.getValorFormatado();

        	test.equals(10, valorFormatado.length);
        	test.equals('0000000318', valorFormatado);
        	test.done();
        },

        'O valor formatado deve ter 10 digitos - 4': function(test) {
        	var boleto = Boleto.novoBoleto().comValorBoleto(300),
        		valorFormatado = boleto.getValorFormatado();

        	test.equals(10, valorFormatado.length);
        	test.equals('0000030000', valorFormatado);
        	test.done();
        },

        'São consideradas apenas as primeiras duas casas decimais do valor': function(test) {
        	var boleto = Boleto.novoBoleto().comValorBoleto(3.189),
        		valorFormatado = boleto.getValorFormatado();

        	test.equals(10, valorFormatado.length);
        	test.equals('0000000318', valorFormatado);
        	test.done();
        },

        'Número do documento formatado deve ter 4 digitos': function(test) {
        	var boleto = Boleto.novoBoleto().comNumeroDoDocumento('232'),
        		numeroFormatado = boleto.getNumeroDoDocumentoFormatado();

			test.equals(4, numeroFormatado.length);
        	test.equals('0232', numeroFormatado);
        	test.done();
        },

        'Boleto não deve aceitar mais do que cinco instruções': function(test) {
        	test.throws(function() {
        		Boleto.novoBoleto().comInstrucoes('', '', '', '', '', '');
        	});

        	test.throws(function() {
        		Boleto.novoBoleto().comInstrucoes(['', '', '', '', '', '']);
        	});

        	test.done();
        },

        'Boleto não deve aceitar mais do que cinco descrições': function(test) {
        	test.throws(function() {
        		Boleto.novoBoleto().comDescricoes('', '', '', '', '', '');
        	});

        	test.throws(function() {
        		Boleto.novoBoleto().comDescricoes(['', '', '', '', '', '']);
        	});

        	test.done();
        },

        'Boleto não deve aceitar mais do que dois locais de pagamento': function(test) {
        	test.throws(function() {
        		Boleto.novoBoleto().comLocaisDePagamento('', '', '');
        	});

        	test.throws(function() {
        		Boleto.novoBoleto().comLocaisDePagamento(['', '', '']);
        	});

        	test.done();
        }
    }
};