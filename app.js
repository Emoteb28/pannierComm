(function() {

  let axiosWrapper = (function() {
	  let endpoint = "https://tools.sopress.net/iut/panier/api/";
	  let token = "test@gmail.com";
	  function setUrl(uri) {
		return endpoint + uri + "?token=" + encodeURIComponent(token);
	  }
	  return {
		get(uri) {
		  return axios.get(setUrl(uri))
		},
		post(uri) {
		  return axios.post(setUrl(uri))
		},
		put(uri) {
		  return axios.put(setUrl(uri))
		},
		delete(uri) {
		  return axios.delete(setUrl(uri))
		},
	  };
  })();

  let panier = (function() {
    return {
      modules : {}
    }
  })();

  panier.modules.actions = (function() {
    return {
	    ajouterAuPanier(pid){
    	    axiosWrapper.post('/cart/'+ pid).then(function(response){
        		panier.modules.actions.construirePanier(response.data);
    		})
    		total = axios.get('/cart/');
    		console.log(total);
    		document.querySelector('#total').innerHTML='€';
   		},
 
		

	chargerProduits(){
		
		axiosWrapper.get('products').then(function(response){
			// console.table(response.data);
			panier.modules.actions.construireListeproduits(response.data);
		});
		
	},

    chargerPanier(){
      axiosWrapper.get('cart').then(function(response){
        panier.modules.actions.construirePanier(response.data);
      })

    },

    retirerPanier(pid){
      axiosWrapper.delete('cart/' + pid).then(function(response){
        panier.modules.actions.construirePanier(response.data);
      })

    },

    supprimerPanier(){
      axiosWrapper.delete('cart').then(function(response){
        panier.modules.actions.construirePanier(response.data);
      })
	  document.querySelector('#panierContent').innerHTML="";
    },

    validerPanier(produits){
      	for(let i=0;i<produits.length;i++){
      		intervalle = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
      		setTimeout(function(){
     			produits[i].style.backgroundColor='green';
	      		console.log(produits[i]);
      		},intervalle);
      	}
    },

    
    construirePanier(produits){

      let html = [];
	  produits.forEach(function(produit){
        html.push(
          `<div class="ligne-produit">
			  <button class='croixRetirerPanier' style="float:right">X</button><br>
	          <b>${produit.qte}x ${produit.nom}</b>
	          <p>${produit.prix} €</p>
          </div>`
        ); 
	  });		

        $('#panierContent').html(html.join(''));

      },

		construireListeproduits(produits){
			
			let html = [];
			produits.forEach(function(produit){
				html.push(
					`<div class="case-produit">
						<b>${produit.nom}</b>
				        <br/>
				        <img src="${produit.photo}" width="150" >
						<p>${produit.description}</p>
						<p>${produit.prix} €</p>
				        <button data-id="${produit.id}" class="ajouter-au-panier" style="float:center;margin:0 10px 0 20px;">Ajouter au panier</button>
					</div>`
				);					
			});
			

			$('#products').html(html.join(''));
		}
    }
  })();

  panier.modules.app = (function() {
    return {
		start() {
			panier.modules.actions.chargerProduits();
      		panier.modules.actions.chargerPanier();

        
      $(document).on('click','.ajouter-au-panier',function(){
        let id = $(this).data('id');
          panier.modules.actions.ajouterAuPanier(id);
	  });
	  
      $(document).on('click','#empty',function(){
        let id = $(this).data('id');
          panier.modules.actions.supprimerPanier();
	  });
	  
      $(document).on('click','#buy',function(){
        let produits = document.getElementById('panierContent').children;
        panier.modules.actions.validerPanier(produits);
	  });
	  
      $(document).on('click','.croixRetirerPanier',function(){
        let id = $(this).data('id');
        panier.modules.actions.retirerPanier(id);
	  });
	
		}
    }
  })();
  
  
  window.addEventListener("load", panier.modules.app.start)
})();