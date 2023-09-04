
require([
    "esri/Map", // Ορίζει το basemap (επίπεδο) που θα έχει ο χάρτης
    "esri/views/MapView", // Δημιουργεί τον  2D χάρτη ορίζοντας παραμέτρους
    "esri/layers/FeatureLayer", // Καλεί από κάποιο service τα χαρακτηριστικά των layers του π.χ. προκαθορισμένα σημεία-points του service που ορίζουν κάποιες εκκλησίες
    "esri/PopupTemplate", // Καλεί ένα popup για κάποιο συγκεκριμένο layer
    "esri/widgets/Search", // Στο search γίνεται αναζήτηση για εντοπισμό περιοχών, χαρακτηριστικών (π.χ. η τάδε εκκλησία που υπάρχει σαν feature) κλπ
    "esri/widgets/BasemapGallery", // Το BasemapGallery εμφανίζει διαφορετικά υπόβαθρα χαρτών ώστε αν χρειαστεί να μπορεί ν αλλάξει το υπόβαθρο του προκαθορισμένου χάρτη απο το Map
    "esri/widgets/Legend", // Με το Legend εμφανίζεται ένα υπόμνημα
    "esri/renderers/UniqueValueRenderer", // Με το UniqueValueRenderer μπορούμε να έχουμε ένα δυναμικό υπόμνημα βάσει του service που τραβάμε, και μπορεί να δημιουργεί περισσότερα από ένα σύμβολα
    "esri/widgets/Editor"
], function (Map, MapView, FeatureLayer, PopupTemplate, Search, BasemapGallery, Legend, UniqueValueRenderer, Editor) {

    // Δημιουργώ μια μεταβλητή "myMap" και της ορίζω ένα basemap όποιο θέλω
    var myMap = new Map({
        basemap: "streets-vector"
    });


    // Δημιουργώ μια μεταβλητή "view" την οποία την ενσωματώνω σε κάποιο div ("viewDiv")
    // Της ορίζω ότι ο χάρτης ο οποίος θα έχει, θα είναι το basemap της μεταβλητής "myMap"
    // Το ζουμ στον χάρτη θα είναι το 11
    // Το σημείο που θα κεντράρει ο χάρτης όταν ανοίγει (center), θα είναι στο σημείο (23.356161, 40.818535)
    var view = new MapView({
        container: "viewDiv", // !!!Μεγάλη προσοχή στο style που δόθηκε για το div
        map: myMap,
        zoom: 11,
        center: [23.356161, 40.818535]
    });

    // Ορίζω μια μεταβλητή "serviceUrl" η οποία παίρνει ως "τιμή" το layer και τον service που θέλω να εκμεταλλευτώ. Στη συγκεκριμένη περίπτωση παίρνω το layer 0.
    var serviceUrl = "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/churches/FeatureServer/0";

    // Ορίζω μια μεταβλητή "layer" η οποία με το FeatureLayer θα καλεί τα χαρακτηριστικά του layers από τον service που όρισα "serviceUrl"
    // Με το ouyFields καλώ τα πεδία του layer, και με το "*" καλώ όλα τα πεδία
    // Ορίζω την μεταβλητή "popupTemplate" η οποία θα μπορεί να δημιουργήσει ένα popup για το συγκεκριμένο layer
    // Με τα title και content ορίζω τον τίτλο και τα περιεχόμενα του popup
    var layer = new FeatureLayer(serviceUrl, {
        outFields: "*",
        popupTemplate: new PopupTemplate({
            title: "{name}",
            content: "<b>Τύπος:</b>  {church_type} <b></br>  Γιορτάζει:</b> {cel_date}"
        })
    });

    // Για να φανούν τα χαρακτηριστικά των πεδίων του layer, πρέπει να το καλέσω
    // Με το myMap.layers.add(layer), ορίζω πως στην μεταβλητή "myMap", δλδ στον χάρτη μου, θα προσθέσω ένα layer και θα το καλέσω. Στο συγκεκριμένο καλώ το layer με όνομα layer
    myMap.layers.add(layer);


    // Δημιουργώ μια μεταβλητή "searchWidget" η οποία θα είναι η αναζήτηση του χάρτη
    // Με το view: view ορίζω ότι η αναζήτηση θέλω να φαίνεται στον χάρτη της μεταβλητής "view"
    var searchWidget = new Search({
        view: view
    });

    // Για να φανεί το εικονίδιο της αναζήτησης, πρέπει να του αρίσω κάποια θέση
    // Με το view.ui.add προσθέτω την μεταβλητή της αναζήτησης "searchWidget" στον χάρτη
    // Με το position: "top-left" ορίζω η αναζήτηση να είναι πάνω αριστερά στον χάρτη
    // Με το index: 2 ορίζω να βρίσκεται στη δεύτερη θέση από πάνω αριστερά σε περίπτωση που υπάρχει κάποιο άλλο αντικείμενο π.χ. το +,- που υπάρχει
    view.ui.add(searchWidget, {
        position: "top-left",
        index: 2
    });


    // Δημιουργώ μια μεταβλητή "basemapGallery" η οποία θα έχει μια σειρά από διαορετικά υπόβαθρα χαρτών σε περίπτωση που θέλω ν αλλάξω το προκαθορισμένο της μεταβλητής "myMap"
    // Με το view: view ορίζω ότι η αναζήτηση θέλω να φαίνεται στον χάρτη της μεταβλητής "view"
    var basemapGallery = new BasemapGallery({
        view: view
    });

    // Για να φανεί η καρτέλα των υποβάθρων, πρέπει να της αρίσω κάποια θέση
    // Με το view.ui.add προσθέτω την μεταβλητή των υποβάθρων "basemapGallery" στον χάρτη
    // Με το position: "top-right" ορίζω η αναζήτηση να είναι πάνω δεξιά στον χάρτη
    view.ui.add(basemapGallery, {
        position: "top-right"
    });


    // Δημιουργώ μια μεταβλητή "legend" η οποία τραβάει και εμφανίζει ένα υπόμνημα από το legend της esri
    // Με το view: view ορίζω ότι το υπόμνημα θέλω να φαίνεται στον χάρτη της μεταβλητής "view"
    var legend = new Legend({
        view: view
    });

    // Για να φανεί το υπόμνημα, πρέπει να του αρίσω κάποια θέση
    // Με το view.ui.add προσθέτω την μεταβλητή του υπομνήματος "legend" στον χάρτη
    // Με το position: "bottom-right" ορίζω το υπόμνημα να είναι κάτω δεξιά στον χάρτη
    view.ui.add(legend, {
        position: "bottom-right"
    });



    // Δημιουργώ μια μεταβλητή "layer_renderer" η οποία θα κουβαλάει ένα δυναμικό υπόμνημα βάσει του service που χρησιμοποιούμε
    // Αντί να γράψουμε "new UniqueValueRenderer" και να κάνουμε ερώτηση στο require, θα μπορούσαμε μέσα στις παρενθέσεις να βάλουμε το (type: "unique-value"), κάνει ακριβώς την ίδια δουλειά
    // Στο field ορίζουμε το πεδίο του layer που θέλουμε να τραβήξουμε πληροφορία για το υπόμνημα από τον service
    // To defaultSymbol: { type: "simple-marker" } το χρησιμοποιούμε για να μα δείχνει "άλλον" συμβολισμό για τα σύμβολα που δεν είναι του θέματος
    // Με το uniqueValueInfos ορίζω τα περισσότερα από ένα σύμβολα στο υπόμνημα
    // Θα μπορούσα να χρησιμοποιήσω και το visualVariables ως διάγραμμμα μεταβλητής
    var layer_renderer = new UniqueValueRenderer({
        //  type: "unique-value",  <- Αντί του UniqueValueRenderer
        field: "church_type",
        uniqueValueInfos:
            [{





                // Με το value ορίζω σε ποιά τιμή μέσα από το πεδίο του service απευθύνεται το σύμβολο
                // Μέσα στο symbol ορίζω τις παραμέτρους πως θα είναι το σύμβολο
                // Στο type ορίζω τον τύπο του συμβόλου π.χ. "picture-marker" = κάποιο εικονίδιο, "simple-marker"= κάποιο points, "simple-fill"= κάποιο πολύγωνο
                // Στο url ορίζω τη διεύθυνση της εικόνας όπου ορίζω ως σύβολο
                // Στο width ορίζω το πλάτος του συμβόλου
                // Στο height ορίζω το ύψος του συμβόλου 
                value: "1",
                symbol: {
                    type: "picture-marker",
                    url: "./image/symbol_church_1.png",
                    width: "15px"
                }
            },


            {
                value: "2",
                symbol: {
                    type: "picture-marker", 
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMyItVLtL_aslhfAfn7wD5GSkVL5hAGAwrw5FSRllY4H3HIUJCjYh1RCOaDiHfASSU5Dg&usqp=CAU",
                    width: "15px"
                }
            },


            {
                value: "3",
                symbol: {
                    type: "picture-marker", 
                    url: "https://st.depositphotos.com/1041273/4460/v/450/depositphotos_44606909-stock-illustration-church-icon.jpg",
                    width: "15px"
                }
            },],

    });

    // Με το layer.renderer ορίζω ότι θέλω να φαίνεται το υπόμνημα του layer στον χάρτη, βάσει της μεταβλητής "layer_renderer"
    layer.renderer = layer_renderer



    var editor = new Editor({
        view: view
      });
      
      view.ui.add(editor, "bottom-left");

});