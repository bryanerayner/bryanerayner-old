<?php 
/*Template Name: Services */
get_header();
?>
	

<div id="content-services" class="hfeed column <?php echo $col_class; ?>">

	<?php
		$layout = get_theme_mod('theme_layout');
		$col_class = 'large-8';

		if($layout === '1c') {
			$col_class = 'large-12';
		} 
	?>

	<?php if ( have_posts() ) : ?>

		<?php while ( have_posts() ) : the_post(); ?>
			<?php

			/*
			echo var_dump(get_post_type());

			echo var_dump(post_type_supports( get_post_type(), 'post-formats' ) );

			echo var_dump(post_type_supports( get_post_type(), 'post-formats' ) ? get_post_format() : get_post_type() );

			 

			// */	

			?>
			<?php get_template_part( 'content', ( post_type_supports( get_post_type(), 'post-formats' ) ? get_post_format() : get_post_type() ) ); ?>

			<?php if ( is_active_sidebar( 'services' ) ) { ?>

				<?php dynamic_sidebar( 'services' ); ?>

			<?php } ?>


			<?php if ( is_singular() && "page" != get_post_type() ) comments_template(); // Loads the comments.php template. ?>

		<?php endwhile; ?>

	<?php else : ?>

		<?php get_template_part( 'loop-error' ); // Loads the loop-error.php template. ?>

	<?php endif; ?>

	<?php get_template_part( 'loop-nav' ); // Loads the loop-nav.php template. ?>

	</div><!-- #content -->

<?php get_footer(); // Loads the footer.php template. ?>