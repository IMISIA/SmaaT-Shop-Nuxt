var Color = require('color');

export default {
    created() {
        // this.web_color = '#e91e63';
        this.web_color = '#0ecfc6';
        if(process.client) {
            this.window.width = window.innerWidth;
            this.$nextTick(() => {
                window.addEventListener('resize', () => {
                    this.window.width = window.innerWidth;
                });
            })
        }
    } ,

    data() {
        return {
            web_color : '#0ECFC6' ,

            window: {
                width: 0
            }
        }
    } ,

    computed : {
        Res() {
            return this.window.width < 770 ? true : false;
        } ,

        isLight() {
            return Color(this.web_color).isLight();
        } ,

        web_color_light() {
            return Color(this.web_color).lighten(0.4).rotate(10).rgb().string();
        } ,

        web_color_dark() {
            return Color(this.web_color).darken(0.2).rgb().string();
        } ,

        web_color_fade() {
            return Color(this.web_color).fade(0.4).rgb().string();
        } ,

        web_color_ultra_fade() {
            return Color(this.web_color).fade(0.97).rgb().string();
        }
    } ,

    methods: {
        is_exist(val) {
            if( !!val && typeof val == 'number' ) {
                return true;
            } else if(process.client) {
                return typeof val === 'string' ? !(_.isEmpty(val.trim())) : !(_.isEmpty(val)); 
            }
        } ,

        notif(title, msg, color, icon, time = 3000)  {
            this.$vs.notify({
                title : `${title}` , 
                text: `${msg}` ,
                color: color ,
                icon: icon ,
                position: 'top-left',
                time: time
            })
        } ,

        emptyProps(obj) {
            Object.keys(obj).map( el => obj[el] = '' )
        } ,

        DynamicSidebar(target, checker, top = 0, overflowSidebar = 0) {
            if(isNaN(overflowSidebar)) overflowSidebar = 0;

            let firstPosition = $(target).offset().top;

            let element = {
                target: $(target) ,
                height() {
                    return this.target.outerHeight();
                } ,
                width() {
                    return this.target.outerWidth();
                } ,
                offsetFromTop() {
                    return this.target.offset().top;
                } ,
                parent() {
                    return this.target.parent();
                } ,
                parentBottomPosition() {
                    return this.parent().offset().top + this.parent().outerHeight();
                } ,
                reachDown() {
                    return (this.offsetFromTop() + this.height() + 1) > this.parentBottomPosition();
                } ,
                fixed() {
                    this.target.css({
                        position: 'fixed',
                        top: top,
                        width: this.target.width()
                    })
                } ,
                absolute() {
                    this.target.css({
                        position: 'absolute',
                        top: '',
                        bottom: '0',
                        width: this.target.width()
                    })
                } ,
                removeStyles() {
                    this.target.css({
                        position: '',
                        top: '',
                        bottom: '',
                        width: ''
                    })
                }
            }

            $(window).scroll(function() {
                let scrollFromTop = $(this).scrollTop();

                if(
                    (element.height() + overflowSidebar) < $(checker).outerHeight() &&
                    scrollFromTop > (firstPosition - top)
                ) {
                    if(element.reachDown()) {
                        (scrollFromTop + top) < element.offsetFromTop() ? element.fixed() : element.absolute();
                    } else {
                        element.fixed();
                    }
                } else {
                    element.removeStyles();
                }
            })
        }
    }
}