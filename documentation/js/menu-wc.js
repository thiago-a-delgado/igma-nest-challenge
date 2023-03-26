'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Igma Challenge - API Documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="todo.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>TODO
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' : 'data-target="#xs-controllers-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' :
                                            'id="xs-controllers-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' : 'data-target="#xs-injectables-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' :
                                        'id="xs-injectables-links-module-AppModule-faa5905b2b88fd73951a4a0a08d692c05185d13f9da448cbbab431be0157b78693784616c6b7e82057fe682ee27f418570d17682b299f846102aa484d4568bdd"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomerModule.html" data-type="entity-link" >CustomerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' : 'data-target="#xs-controllers-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' :
                                            'id="xs-controllers-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' }>
                                            <li class="link">
                                                <a href="controllers/CustomerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' : 'data-target="#xs-injectables-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' :
                                        'id="xs-injectables-links-module-CustomerModule-d83c8f09cadfcc3029b0a17d9f2491005d1b61a270276a0f24588971159764e9bfe5da6a7a20521bde2e3ef33641f35e136554b6bb18cc17742b3e274e889015"' }>
                                        <li class="link">
                                            <a href="injectables/CustomerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Customer.html" data-type="entity-link" >Customer</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateCustomerDto.html" data-type="entity-link" >CreateCustomerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCustomerDto.html" data-type="entity-link" >UpdateCustomerDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});