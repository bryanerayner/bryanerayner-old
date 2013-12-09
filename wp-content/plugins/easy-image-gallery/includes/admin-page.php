<?php
/**
 * Admin options
 *
 * @since 1.0
 */
function easy_image_gallery_menu() {
	add_plugins_page( __( 'Easy Image Gallery', 'easy-image-gallery' ), __( 'Easy Image Gallery', 'easy-image-gallery' ), 'manage_options', 'easy-image-gallery', 'easy_image_gallery_admin_page' );
}
add_action( 'admin_menu', 'easy_image_gallery_menu' );


/**
 * Admin page
 *
 * @since 1.0
 */

function easy_image_gallery_admin_page() { ?>
    <div class="wrap">
    	 <?php screen_icon( 'plugins' ); ?>
        <h2><?php _e( 'Easy Image Gallery', 'easy-image-gallery' ); ?></h2>

        <form action="options.php" method="POST">

        	<?php settings_errors(); ?>

            <?php settings_fields( 'my-settings-group' ); ?>

            <?php do_settings_sections( 'easy-image-gallery-settings' ); ?>

            <?php submit_button(); ?>
        </form>

    </div>
<?php
}


/**
 * Admin init
 *
 * @since 1.0
 */
function easy_image_gallery_admin_init() {

	register_setting( 'my-settings-group', 'easy-image-gallery', 'easy_image_gallery_settings_sanitize' );

	// sections
	add_settings_section( 'general', __( 'General', 'easy-image-gallery' ), '', 'easy-image-gallery-settings' );

	// settings
	add_settings_field( 'lightbox', __( 'Lightbox', 'easy-image-gallery' ), 'lightbox_callback', 'easy-image-gallery-settings', 'general' );
	add_settings_field( 'post-types', __( 'Post Types', 'easy-image-gallery' ), 'post_types_callback', 'easy-image-gallery-settings', 'general' );

}
add_action( 'admin_init', 'easy_image_gallery_admin_init' );


/**
 * Lightbox callback
 *
 * @since 1.0
 */
function lightbox_callback() {

	// default option when settings have not been saved
	$defaults['lightbox'] = 'prettyphoto';
	
	$settings = (array) get_option( 'easy-image-gallery', $defaults );

	$lightbox = esc_attr( $settings['lightbox'] );
?>
	<select name="easy-image-gallery[lightbox]">
		<?php foreach ( easy_image_gallery_lightbox() as $key => $label ) { ?>
			<option value="<?php echo $key; ?>" <?php selected( $lightbox, $key ); ?>><?php echo $label; ?></option>
		<?php } ?>
	</select>

	<?php if ( 'fancybox' == $lightbox ) : ?>
	<p class="description"><?php printf( __( 'Please note: fancyBox requires a %s for commercial use', 'easy-image-gallery' ), '<a title="fancyBox" href="http://fancyapps.com/fancybox/#license" target="_blank">license</a>' ); ?></p>
	<?php endif; ?>

	<?php

}

/**
 * Post Types callback
 *
 * @since 1.0
 */

function post_types_callback() {

	// post and page defaults
	$defaults['post_types']['post'] = 'on';
	$defaults['post_types']['page'] = 'on';

	$settings = (array) get_option( 'easy-image-gallery', $defaults );

?>
		<?php foreach ( easy_image_gallery_get_post_types() as $key => $label ) {

		$post_types = isset( $settings['post_types'][ $key ] ) ? esc_attr( $settings['post_types'][ $key ] ) : '';

?>
		<p>
			<input type="checkbox" id="<?php echo $key; ?>" name="easy-image-gallery[post_types][<?php echo $key; ?>]" <?php checked( $post_types, 'on' ); ?>/><label for="<?php echo $key; ?>"> <?php echo $label; ?></label>
		</p>
		<?php } ?>
	<?php

}


/**
 * Sanitization
 *
 * @since 1.0
 */
function easy_image_gallery_settings_sanitize( $input ) {

	// Create our array for storing the validated options
	$output = array();

	// lightbox
	$valid = easy_image_gallery_lightbox();

	if ( array_key_exists( $input['lightbox'], $valid ) )
		$output['lightbox'] = $input['lightbox'];

	// post types
	$post_types = isset( $input['post_types'] ) ? $input['post_types'] : '';

	// only loop through if there are post types in the array
	if ( $post_types ) {
		foreach ( $post_types as $post_type => $value )
			$output[ 'post_types' ][ $post_type ] = isset( $input[ 'post_types' ][ $post_type ] ) ? 'on' : '';	
	}
	


	return apply_filters( 'sandbox_theme_validate_input_examples', $output, $input );

}


/**
 * Action Links
 *
 * @since 1.0
 */
function easy_image_gallery_plugin_action_links( $links ) {

	$settings_link = '<a href="' . get_bloginfo( 'wpurl' ) . '/wp-admin/plugins.php?page=easy-image-gallery">'. __( 'Settings', 'easy-image-gallery' ) .'</a>';
	array_unshift( $links, $settings_link );

	return $links;
}
