<?php 


	if (function_exists('register_sidebar'))
	{
		register_sidebar(array(
	'name'          => __( 'Services Sidebar' ),
	'id'            => 'services',
	'description'   => 'A sidebar for use in the Services page. Use it to lay out your content on the services page.',
        'class'         => 'services_sidebar',
	'before_widget' => '<div id="%1$s" class="widget %2$s">',
	'after_widget'  => '</div>',
	'before_title'  => '<h2 class="widgettitle">',
	'after_title'   => '</h2>' 
	));

	}




/**
 * Widget Video
 *
 *
 *
 * @author		Bryan Rayner
 * @copyright	Copyright (c) Bryan Rayner, remixed from Bearded Theme
 * @link		http://bonfirelab.com
 * @since		Version 1.0
 * @package 	Bon Toolkit
 * @category 	Widgets
 *
 *
*/ 


/*-----------------------------------------------------------------------------------*/
/*  Widget class
/*-----------------------------------------------------------------------------------*/


class Bearded_Widget_Portfolio_Posts extends WP_Widget {

	

	/*-----------------------------------------------------------------------------------*/
	/*	Widget Setup
	/*-----------------------------------------------------------------------------------*/
	function __construct() {

		$widget_ops = array( 'classname' => 'bearded-portfolio_posts-widget', 'description' => __('Show Latest Portfolio Posts filtered by category. Best use in services widget.', 'bearded') );
		$control_ops = array();
		$this->WP_Widget('bearded-portfolio_posts', __('Bearded Latest Portfolio Posts', 'bearded'), $widget_ops, $control_ops);

	}



	function widget( $args, $instance ) {

		extract($args);
		extract($instance);
		/* Display widget ---------------------------------------------------------------*/
		echo $before_widget; ?>


		<div class="bearded-posts-container row">
			<div class="column large-12">
				<?php if( $title ) { echo $before_title . $title . $after_title; } ?>
				
				<?php 

				$post_type = 'portfolio_item';
				$category_type = '';
				if( $type ) {
					$category_type = $type;
				} 

				$args = array(
					'post_type' => $post_type,
					'posts_per_page' => 4,
					'ignore_sticky_posts' => true,
					'tax_query'=>array(
						array(
						'taxonomy'=>'portfolio',
						'field'=>'slug',
						'terms'=>$category_type
						)
						)
				);
				$loop = new WP_Query( $args );

				if( $loop->have_posts() ) : ?>

				<div class="<?php echo (!empty( $post_type ) && $post_type == 'portfolio_item' ) ? 'row collapse ' : 'row '; echo !empty( $post_type ) ? 'type-'.$post_type : 'type-post'; ?>">

					<?php while( $loop->have_posts() ) : $loop->the_post(); ?>

						<div class="column large-3 large-uncentered small-centered">

							<div class="widget-entry">
								<div class="widget-entry-thumbnail">
							<?php if(current_theme_supports( 'get-the-image' )) { get_the_image( array( 'size' => 'home-thumbnail' ) ); } ?>
								</div>
								<div class="widget-entry-title">
									<?php 
										the_title('<h3><a href="'.get_permalink().'" title="'.the_title_attribute( array('echo' => false ) ).'">', '</a></h3>'); 
									?>
								</div>
							</div>
						</div>

					<?php endwhile; ?>

				</div>

				<?php endif; wp_reset_postdata(); ?>
				
			</div>
		</div>
		
	<?php
		echo $after_widget;
	}


	/*-----------------------------------------------------------------------------------*/
	/*	Update Widget
	/*-----------------------------------------------------------------------------------*/
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;

		$instance = $new_instance;

		$instance['title']   = strip_tags( $new_instance['title'] );
		$instance['type'] = strip_tags($new_instance['type']);

	
		return $instance;
	}


	/*-----------------------------------------------------------------------------------*/
	/*	Widget Settings (Displays the widget settings controls on the widget panel)
	/*-----------------------------------------------------------------------------------*/
	function form( $instance ) {

		/* Set up some default widget settings ------------------------------------------*/
		$defaults = array(
			'title' => 'Latest From The Blog',
			'type' => ''
		);
		
		$instance = wp_parse_args( (array) $instance, $defaults ); 
		
		$categories = get_categories( array('taxonomy' => 'portfolio') );
		/* Build our form ---------------------------------------------------------------*/
		?>

		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><code><?php _e('Title', 'bearded') ?></code></label>
			<input class="widefat" type="text" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" />
		</p>
		
		<p>
			<label for="<?php echo $this->get_field_id( 'type' ); ?>"><code><?php _e('Portfolio Category', 'bearded') ?></code></label>
			<select class="widefat" id="<?php echo $this->get_field_id( 'type' ); ?>" name="<?php echo $this->get_field_name( 'type' ); ?>">

			<?php foreach($categories as $category):?>
			
				<option value="<?php echo $category->category_nicename;?>" <?php selected( $instance['type'], $category->category_nicename ); ?>><?php _e($category->cat_name,'bearded'); ?></option>
						
			<?php endforeach;?>
			</select>
		</p>




		
			
		<?php
		}
}





function bearded_load_portfolio_posts_widget() {
	register_widget( 'Bearded_Widget_Portfolio_Posts' );
}

add_action( 'widgets_init', 'bearded_load_portfolio_posts_widget' );








class Bryanerayner_Service_Highlight extends WP_Widget {

	/*-----------------------------------------------------------------------------------*/
	/*	Widget Setup
	/*-----------------------------------------------------------------------------------*/
	function __construct() {

		$widget_ops = array( 'classname' => 'bryanerayner-service_highlight', 'description' => __('Show text related to services as well as latest portfolio posts filtered by category.', 'bearded') );
		$control_ops = array();
		$this->WP_Widget('bryanerayner-service_highlight', __('Bryanerayner Service Highlights', 'bearded'), $widget_ops, $control_ops);
	}	
	
	function widget($args, $instance) {
		
	
		extract($args);
		extract($instance);
		/* Display widget ---------------------------------------------------------------*/
		echo $before_widget; ?>

		<div class = "row">
			<?php if( $icon_html ) { echo $icon_html; } ?>
			<div class = "column large-5">
				<?php if( $title ) { echo $before_title . $title . $after_title; } ?>
				<div class = "service_description">
					<?php if( $description ) { echo $description; } ?>
				</div>
			</div>

			<div class="column large-7">
				<?php if( $project_title ) { echo '<h4 class = "projects_title">' . $project_title . "</h4>"; } ?>
				
				<?php 

				$post_type = 'portfolio_item';
				$category_type = '';
				if( $type ) {
					$category_type = $type;
				} 

				$args = array(
					'post_type' => $post_type,
					'posts_per_page' => 2,
					'ignore_sticky_posts' => true,
					'tax_query'=>array(
						array(
						'taxonomy'=>'portfolio',
						'field'=>'slug',
						'terms'=>$category_type
						)
						)
				);
				$loop = new WP_Query( $args );

				if( $loop->have_posts() ) : ?>

				<div class="<?php echo (!empty( $post_type ) && $post_type == 'portfolio_item' ) ? 'row collapse ' : 'row '; echo !empty( $post_type ) ? 'type-'.$post_type : 'type-post'; ?>">

					<?php while( $loop->have_posts() ) : $loop->the_post(); ?>

						<div class="column large-6 small-12 large-uncentered small-centered">

							<div class="widget-entry">
								<div class="widget-entry-thumbnail project_thumbnail">
							<?php if(current_theme_supports( 'get-the-image' )) { get_the_image( array( 'size' => 'home-thumbnail' ) ); } ?>
								</div>
								<div class="widget-entry-title project_title">
									<?php 
										the_title('<h3><a href="'.get_permalink().'" title="'.the_title_attribute( array('echo' => false ) ).'">', '</a></h3>'); 
									?>
								</div>
							</div>
						</div>

					<?php endwhile; ?>


				<?php endif; wp_reset_postdata(); ?>
				
			</div>
		</div>
	</div>
		
	<?php
		echo $after_widget;
	}
	
	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		if ( isset($new_instance['description']) ) {
			if ( current_user_can('unfiltered_html') ) {
				$instance['description'] = $new_instance['description'];
			} else {
				$instance['description'] = wp_filter_post_kses($new_instance['description']);
			}
		}
		$instance['project_title']   = strip_tags( $new_instance['project_title'] );
		$instance['type'] = strip_tags($new_instance['type']);

		if ( isset($new_instance['icon_html']) ) {
			if ( current_user_can('unfiltered_html') ) {
				$instance['icon_html'] = $new_instance['icon_html'];
			} else {
				$instance['icon_html'] = wp_filter_post_kses($new_instance['icon_html']);
			}
		}
		

		return $instance;
	}
	
	function form($instance) {

		/* Set up some default widget settings ------------------------------------------*/
		$defaults = array(
			'title' => 'RECOMMENDED READING',
			'description' => '<p>Available for <u>Immediate</u> Download</p>',
			'type' => '',
			'project_title' => 'Recent Projects',
			'icon_html' => ''
		);
		
		$instance = wp_parse_args( (array) $instance, $defaults ); 
		
		$categories = get_categories( array('taxonomy' => 'portfolio') );

		$title = esc_attr($instance['title']);
		$icon_html = $instance['icon_html'];
		$description = $instance['description'];

		/* Build our form ---------------------------------------------------------------*/
		?>

		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>">
				<i><strong><?php _e( 'Title' ); ?></strong></i><br>
				<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
			</label>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('description'); ?>">
				<i><strong><?php _e( 'Description' ); ?></strong></i>
			</label><br/>
			<textarea cols="53" rows="4" class="mceEditor" id="<?php echo $this->get_field_id('description'); ?>" name="<?php echo $this->get_field_name('description'); ?>"><?php echo $description; ?></textarea>
			<a href="#" onclick="showMCE('<?php echo $this->get_field_id('description'); ?>',this);return false;">Show WYSIWYG Editor</a>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'project_title' ); ?>"><code><?php _e('Title', 'bearded') ?></code></label>
			<input class="widefat" type="text" id="<?php echo $this->get_field_id( 'project_title' ); ?>" name="<?php echo $this->get_field_name( 'project_title' ); ?>" value="<?php echo $instance['project_title']; ?>" />
		</p>
		
		<p>
			<label for="<?php echo $this->get_field_id( 'type' ); ?>"><code><?php _e('Portfolio Category', 'bearded') ?></code></label>
			<select class="widefat" id="<?php echo $this->get_field_id( 'type' ); ?>" name="<?php echo $this->get_field_name( 'type' ); ?>">

			<?php foreach($categories as $category):?>
			
				<option value="<?php echo $category->category_nicename;?>" <?php selected( $instance['type'], $category->category_nicename ); ?>><?php _e($category->cat_name,'bearded'); ?></option>
						
			<?php endforeach;?>
			</select>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('icon_html'); ?>">
				<i><strong><?php _e( 'Icon HTML' ); ?></strong></i><br>
				<textarea cols="53" rows="4" class="widefat" id="<?php echo $this->get_field_id('icon_html'); ?>" name="<?php echo $this->get_field_name('icon_html'); ?>"><?php echo $icon_html; ?></textarea>
			</label>
		</p>

<?php
	}	
}
 
// add javascript to widgets page header
add_action('admin_head-widgets.php', 'custom_tinymce');
function custom_tinymce() {
	echo '<script type="text/javascript">
		<!--
		function showMCE(id,linkObj) {
			if (tinyMCE.getInstanceById(id) == null) {
				linkObj.innerHTML = "Hide WYSIWYG Editor";
				tinyMCE.mode = "specific_textareas";
				tinyMCE.execCommand("mceAddControl", false, id);
				jQuery(linkObj).parents(".widget").css({					
					display: "block",
					width: "500px",
					left: "-100%",
					position: "relative"
				});
			}	else {
				linkObj.innerHTML = "Show WYSIWYG Editor";
				tinyMCE.execCommand("mceRemoveControl", false, id);
				jQuery(linkObj).parents(".widget").css({					
					display: "",
					width: "",
					left: "",
					position: ""
				});
			}
		}
		try{
			tinyMCE.init({
			theme : "advanced",
			mode : "none",
			plugins : "style",
			skin: "default",
			dialog_type:"modal",
			theme_advanced_buttons1: "fontselect,fontsizeselect,formatselect,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,justifyfull",
			theme_advanced_buttons2: "bold,italic,underline,strikethrough,|,forecolor,styleprops,|,link,unlink,|,removeformat,charmap,blockquote,|,outdent,indent,|,undo,redo",
			theme_advanced_buttons3: "",
			theme_advanced_buttons4: "",
			spellchecker_languages: "+English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr,German=de,Italian=it,Polish=pl,Portuguese=pt,Spanish=es,Swedish=sv",
			theme_advanced_toolbar_location:"bottom",
			theme_advanced_toolbar_align:"center",
			theme_advanced_resizing:"1",
			theme_advanced_resize_horizontal:"",
			editor_selector: "mceEditor",
			width : "200",
			height : "200",
			setup : function(ed){ed.onChange.add(function(ed){tinyMCE.triggerSave();});}
			});
		}catch (e)
		{

		}
		-->
		</script>
	';
}


function bryanerayner_load_service_higlight_widget() {
	register_widget( 'Bryanerayner_Service_Highlight' );
}

add_action( 'widgets_init', 'bryanerayner_load_service_higlight_widget' );









?>