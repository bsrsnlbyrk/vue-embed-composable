import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { mount, createLocalVue } from '@vue/test-utils';
import { useEmbed } from './useEmbed';

Vue.use(VueCompositionAPI);

const localVue = createLocalVue();
localVue.component('test-component', {
  template: `
    <div>
      <textarea v-model="embed"></textarea>
      <div v-if="useEmbed(embed).isEmbedBlock.value" id="embed-preview" v-html="embed"></div>
    </div>
  `
});

const Component = localVue.component('test-component');

describe('use embed composable tests', () => {
  test('embed preview have to be rendered if embed block computed is true', () => {
    const wrapper = mount(Component, {
      data: () => ({
        embed: '<blockquote class="twitter-tweet"></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8">'
      }),
      mocks: {
        useEmbed
      }
    });

    expect(wrapper.find('#embed-preview').exists()).toBe(true);
  });

  test('embed preview have to be not rendered if embed block computed is false', () => {
    const wrapper = mount(Component, {
      data: () => ({
        embed: ''
      }),
      mocks: {
        useEmbed
      }
    });

    console.log(useEmbed(wrapper.vm.embed).isEmbedBlock.value);

    expect(wrapper.find('#embed-preview').exists()).toBe(false);
  });
});