<?php
/*
Plugin Name: Animate Slider
Plugin URI: http://bonfirelab.com
Description: A Featured Slider Plugin with CSS3 Transition.
Version: 0.1.3
Author: Hermanto Lim
Author URI: http://www.bonfirelab.com
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * Animate_Slider
 *
 * @package Animate
 * @author Hermanto Lim
 * @license GPLv2 or later
 * @version 0.1.3
 * 
 **/
if( !class_exists( 'Animate_Slider') ) {

	class Animate_Slider {

		/**
		 * @var string
		 * @since 0.1.0
		 */
		public $version = '0.1.3';

		/**
		 * @var string
		 * @since 0.1.0
		 */
		public $plugin_url;

		/**
		 * @var string
		 * @since 0.1.0
		 */
		public $plugin_path;

		/**
		 * @var string
		 * @since 0.1.0
		 * Used as metabox prefix
		 */
		public $prefix = 'as';

		/**
		 * @var string
		 * @since 0.1.0
		 */
		public $post_type_name = 'slider';

		/**
		 * @var array
		 * @since 0.1.0
		 */
		public $supports = array();

		/**
		 * @var string
		 * @since 0.1.0
		 * 
		 */
		public $meta_key_nonce = 'as-meta-nonce';


		/**
		 * @var array
		 * @since 1.0.0
		 * 
		 */
		public $meta_key = array(
			'button'                    => 'as-button',
			'link'                      => 'as-link',
			'background'          		=> 'as-background',
			'caption-position'          => 'as-caption-position',
			'caption-style'             => 'as-caption-style',
		);

		/**
		 * @var array
		 * @since 0.1.0
		 */
		public $available_supports = array( 'thumbnail', 'background', 'caption_position', 'link_button' );


		public function __construct() {

			/* Set the constants needed by the plugin. */
			add_action( 'plugins_loaded', array( &$this, 'constants' ), 1 );

			/* Set the constants needed by the plugin. */
			add_action( 'plugins_loaded', array( &$this, 'i18n' ), 2 );

			/* Load the functions files. */
			add_action( 'plugins_loaded', array( &$this, 'includes' ), 3 );

			add_action( 'init', array( &$this, 'init_post_type') );

			add_action( 'init', array( &$this, 'init') );

			add_action( 'init', array( &$this, 'setup_supports' ) );

			add_action( 'save_post', array( &$this, 'save_meta'), 10, 2 );

			add_action( 'admin_enqueue_scripts', array( &$this, 'admin_enqueue_script') );

			add_action( 'init', array( &$this, 'generate_slider') );

			do_action( 'animate_slider_loaded' );

		}

		/**
		 * Setup Plugin Constants
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function constants() {

			// Define version constant
			if( !defined('AS_VERSION') ) {
				define( 'AS_VERSION', $this->version );
			}
			if( !defined('AS_IMAGES') ) {
				define('AS_IMAGES', $this->plugin_url() . '/assets/images' );
			}
			if( !defined('AS_JS') ) {
				define('AS_JS', $this->plugin_url() . '/assets/js' );
			}
			if( !defined('AS_CSS') ) {
				define('AS_CSS', $this->plugin_url() . '/assets/css' );
			}
			// this used in shortcode
			if( !defined('AS_PREFIX') ) {
				define('AS_PREFIX', $this->prefix );
			}
			if( !defined('AS_TINYMCE') ) {
				define('AS_TINYMCE', $this->plugin_url() . '/includes/tinymce/' );
			}

			/* Set constant path to the plugin directory. */
			if( !defined('AS_DIR') ) {
				define( 'AS_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );
			}

			if( !defined('AS_URI') ) {
				/* Set the constant path to the plugin directory URI. */
				define( 'AS_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
			}
			if( !defined('AS_INC') ) {
				/* Set the constant path to the includes directory. */
				define( 'AS_INC', AS_DIR . trailingslashit( 'inc' ) );
			}

		}

		/**
		 * Loads the translation files.
		 *
		 * @since  0.1.0
		 * @return void
		 */
		public function i18n() {

			/* Load the translation of the plugin. */
			load_plugin_textdomain( 'as', false, dirname( plugin_basename( __FILE__ ) ) .'/lang/' );
		}

		/**
		 * Plugin Init Hook
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function init() {

			add_shortcode( 'as-slider', array( $this, 'generate_slider') );

	  		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue') );

	  		do_action( 'animate_slider_init' );
		}

		/**
		 * Plugin Settings
		 *
		 * @since 0.1.0
		 * @return array
		 * 
		 */
		public function setup_supports() {

	  		$defaults = array(
	  			'background',
	  			'caption-position',
	  			'button',
	  			'caption-style',
	  			'link'
	  		);

	  		$supports = get_theme_support( 'animate-slider' );

	  		if( !empty($supports) && is_array($supports[0]) ) {
	  			$this->supports = $supports[0];
	  		} else {
	  			$this->supports = $defaults;
	  		}

		}


		public function init_post_type() {

			$labels = array(
			    'name'               => __('Sliders','as'),
			    'singular_name'      => __('Slider','as'),
			    'add_new'            => __('Add New','as'),
			    'add_new_item'       => __('Add New Slider','as'),
			    'edit_item'          => __('Edit Slider','as'),
			    'new_item'           => __('New Slider','as'),
			    'all_items'          => __('All Sliders','as'),
			    'view_item'          => __('View Slider','as'),
			    'search_items'       => __('Search Sliders','as'),
			    'not_found'          => __('No Slider Found','as'),
			    'not_found_in_trash' => __('No slider found in Trash','as'),
			    'menu_name'          => __('Animate Slider', 'as')
		  	);


		  	$args = array(
			    'labels'               => $labels,
			    'public'			   => false,
			    'show_in_nav_menus'    => false,
			    'show_ui'              => true,
			    'show_in_menu'		   => true,
			    'exclude_from_search'  => true,
			    'supports'             => array( 'title', 'editor', 'thumbnail', 'page-attributes'),
			    'menu_icon' 		   => trailingslashit( AS_IMAGES ) . 'menuicon.png',
			    'register_meta_box_cb' => array( $this, 'register_metabox' )
	  		);

	  		register_post_type( $this->post_type_name, $args );
		}

		/**
		 * Enqueue Script
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function enqueue() {
			if( !is_admin() ) {

				if( !wp_style_is( 'font-awesome' ) ) {
					wp_register_style( 'as-font-awesome', trailingslashit( AS_CSS ) . 'font-awesome.css', array(), false, 'all');
					wp_enqueue_style('as-font-awesome');
				}
				
				wp_register_style( 'as-front', trailingslashit( AS_CSS ) . 'front.css', array(), false, 'all');

				wp_register_script( 'bxslider', trailingslashit( AS_JS ) . 'jquery.bxslider.min.js', array( 'jquery' ), '4.1.1', true );
				wp_register_script( 'as-front', trailingslashit( AS_JS ) . 'front.js', array('jquery', 'bxslider'), false, true );

				
				wp_enqueue_style( 'as-front' );

				wp_enqueue_script('bxslider');
				wp_enqueue_script('as-front');
			}
		}



		/**
		 * Register Metabox Callback
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function register_metabox() {

			add_meta_box( 'slider-settings', __( 'Settings', 'as' ), array( $this, 'render_setting_box' ), $this->post_type_name, 'normal', 'high' );
		
		}

		/**
		 * Output Metabox Settings HTML
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function render_setting_box( $object, $box ) {

			wp_nonce_field( basename( __FILE__ ), $this->meta_key_nonce );
			?>

			<div class="as-meta-box">
				
				<?php 

					foreach($this->supports as $support ) {

						switch ($support) {

							case 'link':
								$this->render_link_meta($object);
							break;

							case 'button':
								$this->render_button_meta($object);
							break;
							
							case 'caption-position':
								$this->render_caption_position_meta($object);
							break;

							case 'caption-style':
								$this->render_caption_style_meta($object);
							break;

							case 'background':
								$this->render_background_meta($object);
							break;

						}
					}
				
				?>
				
			</div>
		<?php
		}

		/**
		 * Rendering button output
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function render_button_meta( $object ) { ?>

			<p>
				<label for="<?php echo $this->get_meta_name('button'); ?>" style="display:inline-block;width: 120px">
					<?php _e( 'Button Label:', 'as' ); ?>
				</label>
				<input type="text" name="<?php echo $this->get_meta_name('button'); ?>" size="30" id="<?php echo $this->get_meta_name('button'); ?>" value="<?php echo $this->get_meta_value( $object->ID, 'button'); ?>" />
			</p>


		<?php }
		
		/**
		 * Rendering link output
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function render_link_meta( $object ) { ?>

			<p>
				<label for="<?php echo $this->get_meta_name('link'); ?>" style="display:inline-block;width: 120px">
					<?php _e( 'Link:', 'as' ); ?>
				</label>
				<input type="text" name="<?php echo $this->get_meta_name('link'); ?>" size="100" id="<?php echo $this->get_meta_name('link'); ?>" value="<?php echo $this->get_meta_value( $object->ID, 'link'); ?>" />
			</p>

		<?php }

		/**
		 * Rendering caption style output
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function render_caption_style_meta( $object ) { ?>
			<p>
				<?php $selected_style = $this->get_meta_value( $object->ID, 'caption-style'); ?>
				<label for="<?php echo $this->get_meta_value( $object->ID, 'caption-style'); ?>" style="display:inline-block;width: 120px">
					<?php _e( 'Caption Style:', 'as' ); ?>
				</label>
				<select id="<?php echo $this->get_meta_name( 'caption-style'); ?>" name="<?php echo $this->get_meta_name( 'caption-style'); ?>">
					<option value="light" <?php selected( $selected_style, 'light'); ?>><?php _e('Light','as'); ?></option>
					<option value="dark" <?php selected( $selected_style, 'dark'); ?>><?php _e('Dark','as'); ?></option>
				</select>
			</p>

		<?php }

		/**
		 * Rendering caption position output
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function render_caption_position_meta( $object ) { ?>
			<p>
				<?php $selected = $this->get_meta_value( $object->ID, 'caption-position'); ?>
				<label for="<?php echo $this->get_meta_name('caption-position'); ?>" style="display:inline-block;width: 120px">
					<?php _e( 'Caption Position:', 'as' ); ?>
				</label>
				<select id="<?php echo $this->get_meta_name('caption-position'); ?>" name="<?php echo $this->get_meta_name('caption-position'); ?>">
					<option value="left" <?php selected( $selected, 'left'); ?>><?php _e('Left','as'); ?></option>
					<option value="right" <?php selected( $selected, 'right'); ?>><?php _e('Right','as'); ?></option>
					<option value="center" <?php selected( $selected, 'center'); ?>><?php _e('Center','as'); ?></option>
				</select>
			</p>
		<?php  }

		/**
		 * Rendering background image output
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function render_background_meta( $object ) { ?>
			<p class="metabox-image">
				<?php 
					$image = '';
					$thumb = $this->get_meta_value( $object->ID, 'background');
					if($thumb) {
						$image = wp_get_attachment_image_src( intval( $thumb ), 'thumbnail' );
						$image = $image[0];
					}
				?>
				<label for="<?php echo $this->get_meta_name('background'); ?>" style="display:inline-block;width: 120px">
					<?php _e( 'Background Image:', 'as' ); ?>
				</label>
				<span class="meta-thumbnail" id="<?php echo $this->get_meta_name('background'); ?>-preview">
					<img src="<?php echo $image; ?>" alt=""/>
				</span>
				<button data-id="<?php echo $this->get_meta_name('background'); ?>" class="button as-meta-upload"><?php _e('Choose Image','as'); ?></button>
				<input type="hidden" name="<?php echo $this->get_meta_name('background'); ?>" id="<?php echo $this->get_meta_name('background'); ?>" value="<?php echo $thumb; ?>" />
				<button data-id="<?php echo $this->get_meta_name('background'); ?>" class="button as-remove-image"><?php _e('Remove Image','as'); ?></button>
				<br/><code style="margin-left: 120px;"><?php _e('Background for the slide. For thumbnail set in the featured image.', 'as'); ?></code>
			</p>
			
		<?php }
		

		/**
		 * Get Plugin URL
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function plugin_url() {
			if ( $this->plugin_url ) return $this->plugin_url;
			return $this->plugin_url = untrailingslashit( plugins_url( '/', __FILE__ ) );
		}

		/**
		 * Get Plugin Path
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function plugin_path() {
			if ( $this->plugin_path ) return $this->plugin_path;
			return $this->plugin_path = untrailingslashit( plugin_dir_path( __FILE__ ) );
		}

		/**
		 * Check Specific Support
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function in_support( $val ) {

			if(in_array( $val, $this->supports ) ) {
				return true;
			} else {
				return false;
			}

		}

		/**
		 * Get Field Name
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function get_meta_name( $key ) {
			
			if( $key && array_key_exists( $key, $this->meta_key) ) {
				return $this->meta_key[$key];
			} else {
				return false;
			}

		}

		/**
		 * Get Field Name
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function get_meta_value( $id, $key ) {
			
			$val = esc_attr( get_post_meta( $id, $this->meta_key[$key], true) );

			return $val;
		}

		/**
		 * Get Ajax URL
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function ajax_url() {
			return admin_url( 'admin-ajax.php', 'relative' );
		}

		/**
		 * Include required file
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function includes($var) {
			
			require_once( AS_INC . 'functions.php' );
		}

		/**
		 * Saving Meta
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function save_meta( $post_id, $post = '' ) {

			/* Fix for attachment save issue in WordPress 3.5. @link http://core.trac.wordpress.org/ticket/21963 */
			if ( !is_object( $post ) )
				$post = get_post();

			/* Verify the nonce before proceeding. */
			if ( !isset( $_POST[$this->meta_key_nonce] ) || !wp_verify_nonce( $_POST[$this->meta_key_nonce], basename( __FILE__ ) ) )
				return $post_id;

			$meta = array();

			$supports = $this->supports;

			foreach( $supports as $support ) {

				$name = $this->get_meta_name($support);

				if($support == 'link') {
					$meta["{$this->prefix}-{$support}"] = strip_tags( esc_url( $_POST[$name] ) );
				} else {
					$meta["{$this->prefix}-{$support}"] = strip_tags( sanitize_text_field( $_POST[$name]) );
				}
				
			}
			
			foreach ( $meta as $meta_key => $new_meta_value ) {

				/* Get the meta value of the custom field key. */
				$meta_value = get_post_meta( $post_id, $meta_key, true );

				/* If there is no new meta value but an old value exists, delete it. */
				if ( current_user_can( 'delete_post_meta', $post_id, $meta_key ) && '' == $new_meta_value && $meta_value )
					delete_post_meta( $post_id, $meta_key, $meta_value );

				/* If a new meta value was added and there was no previous value, add it. */
				elseif ( current_user_can( 'add_post_meta', $post_id, $meta_key ) && $new_meta_value && '' == $meta_value )
					add_post_meta( $post_id, $meta_key, $new_meta_value, true );

				/* If the new meta value does not match the old value, update it. */
				elseif ( current_user_can( 'edit_post_meta', $post_id, $meta_key ) && $new_meta_value && $new_meta_value != $meta_value )
					update_post_meta( $post_id, $meta_key, $new_meta_value );
			}
		}


		/**
		 * Enqueue Admin Scripts
		 *
		 * @since 0.1.0
		 * @return void
		 * 
		 */
		public function admin_enqueue_script( $hook ) {
			global $post;
			if( ($hook == 'post-new.php' || $hook == 'post.php') && $post->post_type === $this->post_type_name ) {
			    wp_enqueue_style( 'wp-color-picker');
			    wp_enqueue_script( 'wp-color-picker');
				wp_enqueue_script( 'as-admin', trailingslashit( AS_JS ) . 'admin.js' , array('jquery', 'wp-color-picker') , '0.1.0' );
			}
		}

		/**
		 * This is the Front End Output for the slider used in [as-slider] shortcode
		 *
		 * @since 0.1.0
		 * @return string of HTML
		 * 
		 */
		public function generate_slider( $attr ) {

			static $instance = 0;
			$instance++;

			$args = array(
				'post_type' => $this->post_type_name,
				'post_status' => 'publish',
				'orderby' => 'menu_order',
				'order' => 'DESC'
			);


			if ( ! empty( $attr['ids'] ) ) {
				// 'ids' is explicitly ordered, unless you specify otherwise.
				if ( empty( $attr['orderby'] ) )
					$args['orderby'] = 'post__in';
				$args['include'] = $attr['ids'];
			} else {
				// if ids is not specified it will query 5 latest slider posts
				$args['posts_per_page'] = apply_filters( 'animate_slider_slide_number', 5 );
			}

			$slider_posts = get_posts( $args );

			$o = '';

			if( $slider_posts ) : 

				$o .= '<div id="as-slider-container-'.$instance.'" class="as-slider-container">';
				$o .= '<div id="as-slider-'.$instance.'" class="as-slider">';

				foreach( $slider_posts as $post ) :

 					$supports = as_get_meta( $post->ID );


					$o .= '<div class="as-slide-item '. (isset($supports['caption-style']) && !empty($supports['caption-style']) ? 'as-slide-' . $supports['caption-style'] : '') .'">';

					if( isset($supports['background']) && !empty($supports['background']) ) {
						$bg = wp_get_attachment_image( $supports['background'], apply_filters( 'animate_slider_bg_size', 'full' ) );
						$o .= '<div class="as-slide-bg">'. $bg .'</div>';
					}
					
					$o .= '<div class="as-slide-caption '. (isset($supports['caption-position']) && !empty($supports['caption-position']) ? 'as-slide-' . $supports['caption-position'] : '') .'" data-position="'. (isset($supports['caption-position']) && !empty($supports['caption-position']) ? $supports['caption-position'] : '') .'">';
					
						$o .= '<h1 class="as-slide-title">'.$post->post_title.'</h1>';
					
						if($post->post_content != "") {
				            $o .= '<div class="as-slide-content">';
				            	$o .= '<div class="hide-for-medium">';
				            	$o .= wptexturize( wpautop( $post->post_content ) );
				            	$o .= '</div>';

				            	if(isset( $supports['link'] ) && !empty( $supports['link'] ) ) {
				            		$o .= '<a class="as-slide-more" href="'. esc_url( $supports['link'] ) .'" title="'.the_title_attribute( array( 'echo' => false ) ) . '">';
				            			$o .= ( isset( $supports['button'] )  && !empty( $supports['button'] ) ) ? $supports['button'] : __('Read More', 'as');
				            		$o .= '</a>';
				           		}
				               
				            $o .= '</div>';
						}

					$o .= '</div>'; // end slide-caption

					$thumb = get_the_post_thumbnail( $post->ID, apply_filters( 'animate_slider_thumb_size', 'post-thumbnail' ) );
					if( ( isset($supports['caption-position']) && $supports['caption-position'] != 'center' ) &&  !empty($thumb) )  {

			        $o .= '<div class="hide-for-small as-slide-image as-slide-'.$supports['caption-position'].'">';
			        $o .= $thumb;
			        $o .= '</div>';

			    	}
        
      
					$o .= '</div>';

				endforeach;

				$o .= '</div>';
				$o .= '<div id="as-slider-control-'.$instance.'" class="as-slider-control"></div>';
				$o .= '</div>';

			endif;
			
			return $o;
		}
		/**
		 * Just Debuging Value
		 *
		 * @since 0.1.0
		 * @return string
		 * 
		 */
		public function d($var) {
			echo "<pre>", print_r($var), "</pre>";  	
		}


	} // END class 

	$GLOBALS['animateslider'] = new Animate_Slider();
}
?>