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




?>