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

  test('getEmbedScriptSrc should return the src attribute of script tag in embed code', () => {
    const wrapper = mount(Component, {
      data: () => ({
        embed: '<blockquote class="twitter-tweet"></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8">'
      }),
      mocks: {
        useEmbed
      }
    });

    const { getEmbedScriptSrc } = useEmbed(wrapper.vm.embed);
    const scriptSrc = getEmbedScriptSrc();

    expect(scriptSrc).toBe('https://platform.twitter.com/widgets.js');
  });

  test('injectScript should mount script to the DOM', () => {
    const wrapper = mount(Component, {
      data: () => ({
        embed: 'https://platform.twitter.com/widgets.js'
      }),
      mocks: {
        useEmbed
      }
    });

    const { injectScript } = useEmbed();
    injectScript({ id: 'twitter-embed', src: 'https://platform.twitter.com/widgets.js' });

    const script = document.getElementById('twitter-embed');

    expect(script).toBeTruthy();
  });

  test('clearScript should remove script tag that passed as argument', () => {
    const wrapper = mount(Component, {
      data: () => ({
        embed: 'https://platform.twitter.com/widgets.js'
      }),
      mocks: {
        useEmbed
      }
    });

    const { injectScript, clearScript } = useEmbed();
    injectScript({ id: 'twitter-embed', src: 'https://platform.twitter.com/widgets.js' });

    clearScript(document.getElementById('twitter-embed'));

    expect(document.getElementById('twitter-embed')).toBeFalsy();
  })
});